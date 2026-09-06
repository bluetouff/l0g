import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  auditBuiltSite,
  buildCohort,
  parseCsv,
  siteSummary,
  stringifyCsv,
} from './audit-indexation-cohort.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'l0g-indexation-'));
  const dist = join(root, 'dist');
  const page = async (route, body) => {
    const directory = route === '/' ? dist : join(dist, route);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), body);
  };
  await page('/', '<html lang="fr"><head><title>Accueil</title><link rel="canonical" href="https://l0g.fr/"></head><body><a href="/article/">article</a><a href="/glossaire/court/">terme</a></body></html>');
  await page('/article/', '<html lang="fr"><head><title>Article</title><meta property="article:published_time" content="2026-08-28T10:00:00Z"><link rel="canonical" href="https://l0g.fr/article/"></head><body>Un contenu indexable et propre.</body></html>');
  await page('/glossaire/court/', '<html lang="fr"><head><title>Terme</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="https://l0g.fr/glossaire/court/"></head><body>Définition courte.</body></html>');
  await mkdir(join(dist, 'api/v1'), { recursive: true });
  await writeFile(join(dist, 'api/v1/history.csv'), 'date,value\n');
  await writeFile(join(dist, 'sitemap-0.xml'), '<urlset><url><loc>https://l0g.fr/</loc></url><url><loc>https://l0g.fr/article/</loc></url></urlset>');
  t.after(() => rm(root, { recursive: true, force: true }));
  return dist;
}

test('parse et réécrit les CSV cités sans perdre les virgules', () => {
  const parsed = parseCsv('URL,statut GSC,dernière exploration,canonical utilisateur,canonical Google,sitemap,date publication\n"https://l0g.fr/a/","Explorée, non indexée",,,,,\n');
  assert.equal(parsed[0].statut_gsc, 'Explorée, non indexée');
  assert.match(stringifyCsv(parsed, Object.keys(parsed[0])), /"Explorée, non indexée"/);
});

test('classe indexable et noindex voulu depuis le build sans inventer GSC', async (t) => {
  const site = await auditBuiltSite(await fixture(t));
  const base = { derniere_exploration: '', canonical_utilisateur: '', canonical_google: '', sitemap: '', date_publication: '' };
  const cohort = buildCohort([
    { ...base, url: 'https://l0g.fr/article/', statut_gsc: 'Explorée, actuellement non indexée' },
    { ...base, url: 'https://l0g.fr/glossaire/court/', statut_gsc: 'Exclue par noindex' },
    { ...base, url: 'https://l0g.fr/api/v1/history.csv', statut_gsc: 'Explorée, actuellement non indexée' },
    { ...base, url: 'https://l0g.fr/absente/', statut_gsc: 'Détectée, actuellement non indexée' },
  ], site);
  assert.deepEqual(cohort.map(({ decision }) => decision), ['a_indexer', 'noindex_voulu', 'noindex_voulu', 'erreur_reelle']);
  assert.equal(cohort[0].canonical_utilisateur, 'https://l0g.fr/article/');
  assert.equal(cohort[0].date_publication, '2026-08-28T10:00:00Z');
  assert.equal(cohort[0].inlinks_build, 1);
  assert.equal(cohort[0].profondeur_hub, 1);
  assert.deepEqual(siteSummary(site).sitemap_undesirable, []);
});

test('classe les origines historiques sans confondre URL et route', async (t) => {
  const site = await auditBuiltSite(await fixture(t));
  const base = { derniere_exploration: '', canonical_utilisateur: '', canonical_google: '', sitemap: '', date_publication: '' };
  const cohort = buildCohort([
    { ...base, url: 'http://l0g.fr/', statut_gsc: 'Page avec redirection' },
    { ...base, url: 'https://www.l0g.fr/', statut_gsc: 'Page avec redirection' },
    { ...base, url: 'https://l0g.fr/article', statut_gsc: 'Page avec redirection' },
    { ...base, url: 'https://crypto.l0g.fr/', statut_gsc: 'Page en double' },
  ], site);
  assert.deepEqual(cohort.map(({ decision }) => decision), ['redirection', 'redirection', 'redirection', 'inconnue']);
  assert.equal(cohort[3].present_sitemap_build, 'non');
  assert.equal(cohort[3].canonical_build, '');
});

test('extrait le texte avec les règles HTML, y compris les fins de script atypiques', async (t) => {
  const dist = await fixture(t);
  const cases = [
    '<p>Texte visible</p><script>mots caches</script >',
    '<p>Texte visible</p><SCRIPT>mots caches</SCRIPT/>',
    '<p>Texte visible</p><script>mots caches</script attribut=valeur>',
    '<p>Texte visible</p><script>mots caches',
    '<p>Texte visible</p><script>avant</style>encore cache</script>',
    '<p>Texte visible</p><style>mots caches</style >',
    '<p>Texte visible</p><svg><svg><text>cache</text></svg><text>cache aussi</text></svg>',
    '<p>Texte visible</p><!-- mots caches --!>',
  ];
  for (const body of cases) {
    await writeFile(join(dist, 'article/index.html'), `<title>Article</title>${body}`);
    const page = (await auditBuiltSite(dist)).pages.get('/article/');
    assert.equal(page.word_count, 3, body);
    assert.equal(page.title, 'Article');
  }
});

test('préserve le texte encodé et les métadonnées sans reconstruire de balises', async (t) => {
  const dist = await fixture(t);
  await writeFile(join(dist, 'article/index.html'), `<html lang="fr"><head>
    <title>A &amp; B &lt;script&gt; &lt;script</title>
    <link rel="canonical" href="https://l0g.fr/article/">
    <meta name="robots" content="index,follow">
    <meta property="article:published_time" content="2026-08-28T10:00:00Z">
    </head><body><p>Cr&#233;dit &amp; d&#233;p&#244;ts</p>
    <script>const fake = '<meta name="robots" content="noindex"><a href="/faux/">';</script/>
    <a href="/r&#233;el/">Lien</a>
    <svg><a href="/article/">Lien graphique</a></svg></body></html>`);
  const page = (await auditBuiltSite(dist)).pages.get('/article/');
  assert.equal(page.title, 'A & B <script> <script');
  assert.equal(page.word_count, 9);
  assert.equal(page.canonical, '/article/');
  assert.equal(page.lang, 'fr');
  assert.equal(page.publication_date, '2026-08-28T10:00:00Z');
  assert.equal(page.noindex, false);
  assert.equal(page.redirect, false);
  assert.deepEqual(page.links, ['/r%C3%A9el/', '/article/']);
});

test('reconnaît seulement les vraies métadonnées de redirection', async (t) => {
  const dist = await fixture(t);
  for (const [html, expected] of [
    ['<!-- <meta http-equiv="refresh"> --><p>Texte</p>', false],
    ['<script>const fake = \'<meta http-equiv="refresh">\';</script >', false],
    ['<META CONTENT="0;url=/" HTTP-EQUIV="refr&#101;sh">', true],
  ]) {
    await writeFile(join(dist, 'article/index.html'), html);
    assert.equal((await auditBuiltSite(dist)).pages.get('/article/').redirect, expected, html);
  }
});

test('les liens SVG participent au contrôle des destinations, sans compter leurs titres', async (t) => {
  const dist = await fixture(t);
  await writeFile(join(dist, 'article/index.html'), '<link rel="canonical" href="https://l0g.fr/">');
  await writeFile(join(dist, 'index.html'), '<p>Texte visible</p><svg><title>Titre graphique</title><a href="/article/"><text>Lien graphique</text></a></svg>');
  const site = await auditBuiltSite(dist);
  assert.equal(site.pages.get('/').title, '');
  assert.equal(site.pages.get('/').word_count, 2);
  assert.equal(site.inlinks.get('/article/').size, 1);
  assert.equal(site.depths.get('/article/'), 1);
  assert.deepEqual(site.undesirableInternalDestinations, [{ from: '/', to: '/article/', reasons: ['canonical:/'] }]);
});
