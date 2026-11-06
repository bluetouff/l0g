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

// Only the first image in the publication’s own header may bypass lazy loading.
// A marker elsewhere in the document does not make an image a priority hero.
export function articleHeroImageStart(html, route) {
  if (route === 'index.html') {
    const main = firstElement(fromHtml(html), (node) => node.tagName === 'main');
    const featured = firstElement(main, (node) => node.tagName === 'section'
      && node.properties.className?.includes('home-featured'));
    const image = firstElement(featured, (node) => node.tagName === 'img');
    return image && Object.hasOwn(image.properties, 'dataHomeHero')
      ? image.position?.start.offset ?? null : null;
  }
  const weekly = /^hebdo(?:\/[^/]+)?\/index\.html$/.test(route);
  if (!weekly && !/^(?:posts|en\/analysis)\/[^/]+\/index\.html$/.test(route)) return null;
  const article = firstElement(fromHtml(html), (node) =>
    node.tagName === 'article' && Object.hasOwn(node.properties, 'dataPagefindBody'));
  const header = article?.children.find((node) => node.type === 'element'
    && node.tagName === 'header' && node.properties.className?.includes(weekly ? 'issue-head' : 'post-head'));
  const image = firstElement(header, (node) => node.tagName === 'img');
  return image && Object.hasOwn(image.properties, weekly ? 'dataWeeklyCover' : 'dataArticleImage')
    ? image.position?.start.offset ?? null
    : null;
}
