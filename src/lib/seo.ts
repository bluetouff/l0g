import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const TITLE_SUFFIX = ' · l0g.fr';

function plainText(value: string) {
  return toText(fromHtml(String(value || ''), { fragment: true }))
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSeoMetadata(
  title: string,
  description: string,
  options: { seoTitle?: string } = {}
) {
  const editorialTitle = plainText(title) || 'l0g.fr';
  const explicitSeoTitle = plainText(options.seoTitle ?? '');
  // Search engines fit snippets to the available width. Keep the supplied
  // wording complete; a character cutoff can remove the subject or mechanism.
  const fallbackTitle = editorialTitle === 'l0g.fr'
    ? 'l0g.fr · Cartographier le risque économique'
    : `${editorialTitle}${TITLE_SUFFIX}`;
  return {
    title: editorialTitle === 'l0g.fr' ? fallbackTitle : editorialTitle,
    fullTitle: explicitSeoTitle || fallbackTitle,
    description: plainText(description),
  };
}

export function buildRobotsMetadata(robots: 'index,follow' | 'noindex,follow') {
  return robots === 'index,follow' ? `${robots},max-image-preview:large` : robots;
}
