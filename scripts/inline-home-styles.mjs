import { readFile, writeFile } from 'node:fs/promises';
import postcss from 'postcss';

const stylesheetPattern = /<link rel="stylesheet" href="(\/_astro\/[^"?#]+\.css)">/g;

// The home has neither a Markdown body nor Pagefind results. Keep their shared
// styles on every other route, without transferring them in the home document.
export function homeCriticalCss(css) {
  const root = postcss.parse(css);
  root.walkRules(rule => {
    if (rule.selectors?.every(selector => /\.prose\b|\.pagefind-ui(?:\b|__)|\.pf-(?:search|page)\b/.test(selector))) rule.remove();
  });
  root.walkAtRules(rule => { if (rule.nodes?.length === 0) rule.remove(); });
  return root.toString();
}

export async function inlineHomeStylesheetLinks(dir) {
  const homeUrl = new URL('index.html', dir);
  const html = await readFile(homeUrl, 'utf8');
  if (/class="[^"]*\b(?:prose|pagefind-ui|pf-search|pf-page)\b/.test(html)) throw new Error('La home contient du contenu nécessitant les styles éditoriaux ou de recherche');
  const hrefs = [...html.matchAll(stylesheetPattern)].map((match) => match[1]);

  if (!hrefs.length) return { count: 0, bytes: 0 };

  const styles = new Map(await Promise.all([...new Set(hrefs)].map(async (href) => {
    const css = await readFile(new URL(`.${href}`, dir), 'utf8');
    return [href, homeCriticalCss(css).replace(/<\/style/gi, '<\\/style')];
  })));

  let bytes = 0;
  const output = html.replace(stylesheetPattern, (_link, href) => {
    const css = styles.get(href);
    if (typeof css !== 'string') throw new Error(`Feuille critique introuvable : ${href}`);
    bytes += Buffer.byteLength(css);
    return `<style>${css}</style>`;
  });

  await writeFile(homeUrl, output);
  return { count: hrefs.length, bytes };
}

export default function inlineHomeStyles() {
  return {
    name: 'l0g-inline-home-styles',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const result = await inlineHomeStylesheetLinks(dir);
        if (!result.count) throw new Error('Aucune feuille critique trouvée sur la home');
        logger.info(`${result.count} feuilles critiques intégrées à la home (${result.bytes} octets)`);
      },
    },
  };
}
