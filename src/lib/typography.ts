/** Keep existing French punctuation spaces attached in displayed prose only.
 * Wording, whitespace counts and existing non-breaking spaces remain intact. */
export function keepFrenchPunctuation(text: string): string {
  return text
    .replace(/[ \u00a0\u202f]+(?=[:;!?»])/gu, spaces => spaces.replaceAll(' ', '\u00a0'))
    .replace(/«[ \u00a0\u202f]+/gu, opening => opening.replaceAll(' ', '\u00a0'));
}
