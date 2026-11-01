import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import * as yaml from 'js-yaml';
import { analysisTools } from '../src/config/analysis-tools.ts';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const frontmatter = path => yaml.load(read(path).split('---')[1]);

function articlePath(href, language) {
  const url = new URL(href, 'https://l0g.fr');
  assert.equal(url.origin, 'https://l0g.fr');
  assert.equal(url.search, '');
  const prefix = language === 'fr' ? '/posts/' : '/en/analysis/';
  assert.ok(url.pathname.startsWith(prefix));
  const slug = url.pathname.slice(prefix.length).replace(/\/$/, '');
  assert.match(slug, /^[a-z0-9-]+$/);
  const base = `src/content/${language === 'fr' ? 'posts' : 'posts-en'}/${slug}`;
  const path = ['mdx', 'md'].map(extension => `${base}.${extension}`).find(path => existsSync(new URL(`../${path}`, import.meta.url)));
  assert.ok(path, `${href}: article not found`);
  return { path, slug, hash: url.hash.slice(1) };
}

test('the catalogue has unique identities and valid local standalone routes', () => {
  assert.equal(new Set(analysisTools.map(tool => tool.id)).size, analysisTools.length);
  for (const tool of analysisTools) {
    for (const language of ['fr', 'en']) {
      const copy = tool[language];
      for (const field of ['title', 'question', 'description']) assert.ok(copy[field]?.trim(), `${tool.id}/${language}/${field}`);
      if (tool.placement === 'article') continue;
      const url = new URL(copy.href, 'https://l0g.fr');
      assert.equal(url.origin, 'https://l0g.fr');
      assert.ok(existsSync(new URL(`../src/pages${url.pathname.replace(/\/$/, '')}.astro`, import.meta.url)), copy.href);
    }
  }
});

test('embedded tools link to published FR/EN counterparts that render the same component', () => {
  for (const tool of analysisTools.filter(tool => tool.placement === 'article')) {
    const french = articlePath(tool.fr.articleHref, 'fr');
    const english = articlePath(tool.en.articleHref, 'en');
    assert.equal(frontmatter(english.path).sourceArticle, french.slug, tool.id);
    assert.notEqual(frontmatter(french.path).draft, true, tool.id);
    assert.notEqual(frontmatter(english.path).draft, true, tool.id);
    assert.equal(tool.modelHref, undefined, `${tool.id}: do not invent a standalone model endpoint`);
    for (const [language, article] of [['fr', french], ['en', english]]) {
      const source = read(article.path);
      assert.match(source, new RegExp(`<${tool.embeddedComponent}\\s[^>]*lang=["']${language}["']`), `${tool.id}: component locale`);
      const target = articlePath(tool[language].href, language);
      assert.equal(target.slug, article.slug);
      assert.ok(target.hash && !target.hash.startsWith('source-'), `${tool.id}: direct tool anchor missing`);
      const component = read(`src/components/${tool.embeddedComponent}.astro`);
      const literal = target.hash.replace(`-${language}`, '-${lang}');
      // Components either expose a stable root, a generated title, or the
      // medicine renderer's explicit title. The rendered internal-link audit
      // checks the final HTML after the build as well.
      if (tool.embeddedComponent === 'MedicineSupplyLab') {
        assert.match(read('src/lib/medicineSupplyView.mjs'), /id=`medicine-lab-\$\{lang\}`/);
        assert.match(read('src/lib/medicineSupplyView.mjs'), /id="\$\{id\}-title"/);
      } else {
        const prefix = literal.replace(/-title$/, '');
        assert.ok(component.includes(`id="${target.hash}"`) || component.includes(literal) || component.includes(literal.replace('-embed', '-${mode}')) || component.includes(prefix.replace('${lang}', "'+lang")) || (component.includes(prefix) && component.includes('id={`${id}-title`}')) || (component.includes(prefix) && component.includes('id={id}')), `${tool.id}: unknown component anchor ${target.hash}`);
      }
    }
  }
});
