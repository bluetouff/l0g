export function normalizeGlossaryText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr-FR');
}

const WORD_CHARACTER = /[\p{L}\p{N}]/u;

export function glossarySearchText(value) {
  return String(value)
    .replace(/^\s*\[[^\]]+\]:\s+\S+.*$/gm, ' ')
    .replace(/!?\[([^\]]*)\]\([^\n)]*\)/g, '$1')
    .replace(/<https?:\/\/[^>]+>/gi, ' ')
    .replace(/https?:\/\/\S+/gi, ' ');
}

function textContainsBoundedToken(text, token) {
  if (!token) return false;

  let cursor = 0;
  while (cursor < text.length) {
    const index = text.indexOf(token, cursor);
    if (index === -1) return false;

    const before = index === 0 ? '' : text[index - 1];
    const afterIndex = index + token.length;
    const after = afterIndex >= text.length ? '' : text[afterIndex];
    if (!WORD_CHARACTER.test(before) && !WORD_CHARACTER.test(after)) return true;

    cursor = index + token.length;
  }

  return false;
}

export function textContainsGlossaryToken(searchText, rawToken) {
  const token = String(rawToken).trim();
  if (!token) return false;

  const isUppercaseAcronym = /[A-Z]/.test(token) && /^[A-Z0-9+.-]{3,}$/.test(token);
  if (isUppercaseAcronym) return textContainsBoundedToken(searchText, token);

  return textContainsBoundedToken(normalizeGlossaryText(searchText), normalizeGlossaryText(token));
}
