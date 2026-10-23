import { fromHtml } from 'hast-util-from-html';

function firstElement(root, matches) {
  const pending = [...(root?.children ?? [])].reverse();
  while (pending.length) {
    const node = pending.pop();
    if (node.type !== 'element') continue;
    if (matches(node)) return node;
    pending.push(...node.children.slice().reverse());
  }
  return null;
}

// Only the first image in the article's own header may bypass lazy loading.
// A marker elsewhere in the document does not make an image a priority hero.
export function articleHeroImageStart(html, route) {
  if (!/^(?:posts|en\/analysis)\/[^/]+\/index\.html$/.test(route)) return null;
  const article = firstElement(fromHtml(html), (node) =>
    node.tagName === 'article' && Object.hasOwn(node.properties, 'dataPagefindBody'));
  const header = article?.children.find((node) => node.type === 'element'
    && node.tagName === 'header' && node.properties.className?.includes('post-head'));
  const image = firstElement(header, (node) => node.tagName === 'img');
  return image && Object.hasOwn(image.properties, 'dataArticleImage')
    ? image.position?.start.offset ?? null
    : null;
}
