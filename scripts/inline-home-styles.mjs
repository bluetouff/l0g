import { readFile, writeFile } from 'node:fs/promises';

const stylesheetPattern = /<link rel="stylesheet" href="(\/_astro\/[^"?#]+\.css)">/g;

export async function inlineHomeStylesheetLinks(dir) {
  const homeUrl = new URL('index.html', dir);
  const html = await readFile(homeUrl, 'utf8');
  const hrefs = [...html.matchAll(stylesheetPattern)].map((match) => match[1]);

  if (!hrefs.length) return { count: 0, bytes: 0 };

  const styles = new Map(await Promise.all([...new Set(hrefs)].map(async (href) => {
    const css = await readFile(new URL(`.${href}`, dir), 'utf8');
    return [href, css.replace(/<\/style/gi, '<\\/style')];
  })));

  let bytes = 0;
  const output = html.replace(stylesheetPattern, (_link, href) => {
    const css = styles.get(href);
    if (typeof css !== 'string') throw new Error(`Feuille critique introuvable : ${href}`);
    bytes += Buffer.byteLength(css);
    return `<style data-critical-href="${href}">${css}</style>`;
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
