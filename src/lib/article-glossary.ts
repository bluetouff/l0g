import { glossaryEntryBySlug } from '../config/glossary.ts';
import { glossaryAtlasEnBySlug } from '../config/glossary-atlas-en.ts';

/** Ship only the short definitions already linked by this article, never the atlas. */
export function articleGlossaryTerms(body: string) {
  const paths = new Set(Array.from(body.matchAll(/\/(?:glossaire|en\/glossary)\/[a-z0-9-]+\//g), match => match[0]));
  return [...paths].slice(0, 48).flatMap(href => {
    const slug = href.split('/').filter(Boolean).at(-1)!;
    const entry = href.startsWith('/en/') ? glossaryAtlasEnBySlug.get(slug) : glossaryEntryBySlug.get(slug);
    return entry ? [{ label: entry.sigle, name: entry.nom, definition: entry.def, href }] : [];
  });
}
