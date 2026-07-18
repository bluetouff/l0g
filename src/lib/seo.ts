const TITLE_SUFFIX = ' · l0g.fr';

function plainText(value: string) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shorten(value: string, max: number) {
  const text = plainText(value);
  if (text.length <= max) return text;
  const budget = Math.max(1, max - 1);
  const candidate = text.slice(0, budget + 1);
  const punctuation = Math.max(
    candidate.lastIndexOf(' : '),
    candidate.lastIndexOf(' | '),
    candidate.lastIndexOf(' ? '),
    candidate.lastIndexOf('. ')
  );
  const word = candidate.lastIndexOf(' ');
  const cut = punctuation >= Math.floor(budget * 0.55) ? punctuation : word;
  return `${candidate.slice(0, cut > 0 ? cut : budget).replace(/[\s,:;|.?]+$/u, '')}…`;
}

export function buildSeoMetadata(title: string, description: string) {
  const editorialTitle = plainText(title) || 'l0g.fr';
  const titleBudget = editorialTitle === 'l0g.fr' ? 60 : 60 - TITLE_SUFFIX.length;
  const shortTitle = editorialTitle === 'l0g.fr'
    ? 'l0g.fr · Cartographier le risque économique'
    : shorten(editorialTitle, titleBudget);
  return {
    title: shortTitle,
    fullTitle: editorialTitle === 'l0g.fr' ? shortTitle : `${shortTitle}${TITLE_SUFFIX}`,
    description: shorten(description, 155),
  };
}
