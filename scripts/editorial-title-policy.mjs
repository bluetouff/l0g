import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

/** Persistent editorial rule: identify the subject or mechanism directly. */
export function editorialTitleViolation(title) {
  const text = String(title).normalize('NFKC').replace(/\s+/gu, ' ').trim();
  if (/\bce\s+qu(?:e\b|i\b|['’])/iu.test(text)) return 'formule de titre interdite : « ce que / ce qui / ce qu’ »';
  if (/\bwhat\b/iu.test(text)) return 'formule de titre interdite : « What … »';
  return null;
}

function markdownText(node) {
  return node.value ?? (node.children ?? []).map(markdownText).join('');
}

/** Inspect headings as parsed content, excluding code samples and body prose. */
export function contentTitleViolations(body, fields = new Map()) {
  const violations = [];
  const inspect = (title, location) => {
    const rule = editorialTitleViolation(title);
    if (rule) violations.push({ title, location, rule });
  };
  for (const field of ['title', 'seoTitle', 'ogTitle', 'twitterTitle']) {
    if (fields.has(field)) inspect(fields.get(field), field);
  }
  const htmlWalk = (node, location) => {
    if (/^h[1-6]$/u.test(node.tagName ?? '')) inspect(toText(node), location);
    for (const child of node.children ?? []) htmlWalk(child, location);
  };
  const walk = (node) => {
    const location = `body line ${node.position?.start.line ?? '?'}`;
    if (node.type === 'heading') inspect(markdownText(node), location);
    if (node.type === 'html') htmlWalk(fromHtml(node.value, { fragment: true }), location);
    for (const child of node.children ?? []) walk(child);
  };
  walk(unified().use(remarkParse).parse(body));
  return violations;
}
