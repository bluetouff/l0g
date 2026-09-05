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
