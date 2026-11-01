import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import type { Element, Root } from 'hast';
import type { EvidenceLink } from './article-evidence.ts';

function documentKey(href: string) {
  try {
    const url = new URL(href, 'https://l0g.fr');
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return undefined;
    return url.href;
  } catch { return undefined; }
}

/** Presentation only: recover authored HTML anchor labels without changing evidence. */
export function articleEvidenceDocumentLabels(body: string): ReadonlyMap<string, string> {
  const withoutCode = body
    .replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[ \t]*$/gm, ' ')
    .replace(/`[^`\n]*`/g, ' ');
  const tree = fromHtml(withoutCode, { fragment: true });
  const excluded = new Set(['script', 'style', 'template', 'noscript', 'svg', 'pre', 'code']);
  const pending: Array<Root | Element> = [tree];
  const anchors: Element[] = [];
  while (pending.length) {
    const node = pending.pop()!;
    for (let index = node.children.length - 1; index >= 0; index -= 1) {
      const child = node.children[index];
      if (child.type !== 'element') continue;
      if (excluded.has(child.tagName)) node.children.splice(index, 1);
      else {
        pending.push(child);
        if (child.tagName === 'a') anchors.push(child);
      }
    }
  }
  const labels = new Map<string, string>();
  for (const anchor of anchors) {
    const href = anchor.properties.href;
    if (typeof href !== 'string') continue;
    const key = documentKey(href);
    const label = toText(anchor).replace(/\s+/g, ' ').trim();
    if (!key || !label) continue;
    const previous = labels.get(key);
    if (!previous || label.length > previous.length) labels.set(key, label);
  }
  return labels;
}

export function articleEvidenceLinkLabel(link: Pick<EvidenceLink, 'href' | 'label' | 'host'>, labels: ReadonlyMap<string, string>): string {
  const key = documentKey(link.href);
  const authored = key ? labels.get(key) : undefined;
  if (!authored) return link.label;
  const label = link.label.trim().toLowerCase();
  const hostname = key ? new URL(key).hostname : '';
  const generic = new Set(['', 'source', 'référence', 'reference', link.href.toLowerCase(), hostname, hostname.replace(/^www\./, ''), link.host?.toLowerCase()]);
  return generic.has(label) || /^\[?s?\d+\]?$/i.test(label) ? authored : link.label;
}
