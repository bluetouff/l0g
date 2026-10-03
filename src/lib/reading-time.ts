import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import type { Element, Root } from 'hast';

/**
 * Estime le temps de lecture d'un article à partir de son corps Markdown.
 * Base : ~200 mots/minute. Renvoie un entier de minutes (minimum 1).
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const markdown = body
    .replace(/```[\s\S]*?```/g, ' ') // blocs de code
    .replace(/`[^`]*`/g, ' ') // code inline
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1'); // liens/images -> texte
  const tree = fromHtml(markdown, { fragment: true });
  const pending: Array<Root | Element> = [tree];
  const excluded = new Set(['svg', 'style', 'script', 'template']);
  while (pending.length) {
    const node = pending.pop()!;
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      if (child.type !== 'element') continue;
      if (excluded.has(child.tagName)) node.children.splice(i, 1);
      else pending.push(child);
    }
  }
  const text = toText(tree).replace(/[#>*_~`|]/g, ' '); // ponctuation Markdown
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
