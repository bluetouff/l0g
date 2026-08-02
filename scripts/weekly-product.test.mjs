import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  WEEKLY_SCHEDULE,
  latestWeeklyEdition,
  weeklyEditions,
  weeklySitemapLastmods,
} from '../src/config/weekly-editions.ts';
import {
  buildWeeklyChartSvg,
  buildWeeklyCitationText,
  buildWeeklyCsv,
  buildWeeklyLinkedInText,
  buildWeeklyThreadText,
} from '../src/lib/weekly-package.ts';

const root = new URL('../', import.meta.url);

function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('le contrat hebdomadaire fixe la mise en ligne sans liste de diffusion', async () => {
  assert.deepEqual(WEEKLY_SCHEDULE, {
    weekday: 'dimanche',
    weekdayIso: 7,
    time: '08:30',
    timeZone: 'Europe/Paris',
    label: 'Nouvelle édition chaque dimanche à 08 h 30, heure de Paris',
  });
  const edition = latestWeeklyEdition();
  assert.equal(
    weeklySitemapLastmods().get(`https://l0g.fr/hebdo/${edition.slug}/`),
    new Date(edition.publishedAt).toISOString(),
  );

  const [weeklyPage, workflow, privacy] = await Promise.all([
    source('src/pages/hebdo.astro'),
    source('.github/workflows/build.yml'),
    source('src/pages/rgpd.astro'),
  ]);
  assert.doesNotMatch(workflow, /PUBLIC_[A-Z_]*NEWSLETTER/);
  assert.doesNotMatch(weeklyPage, /type="email"/);
  assert.match(privacy, /aucune base de données de comptes ni liste de diffusion/);
  assert.match(weeklyPage, /L’Hebdo explique\. Watch surveille\./);
  assert.match(weeklyPage, /https:\/\/watch\.l0g\.fr\//);
});

test('chaque édition possède tous ses formats et leurs attributions', () => {
  assert.ok(weeklyEditions.length > 0);
  assert.equal(new Set(weeklyEditions.map((edition) => edition.issue)).size, weeklyEditions.length);
  assert.equal(new Set(weeklyEditions.map((edition) => edition.slug)).size, weeklyEditions.length);

  for (const edition of weeklyEditions) {
    assert.ok(edition.analysis.href.startsWith('/posts/'));
    assert.ok(edition.sources.length >= 1);
    assert.ok(edition.sources.some((item) => item.href === edition.chart.sourceUrl));
    assert.ok(edition.chart.sourceUrl.startsWith('https://'));
    assert.ok(edition.chart.points.length >= 1);
    assert.ok(edition.chart.points.every((point) => point.additive === false));
    assert.ok(edition.quote.length > 80);
    assert.ok(edition.linkedin.length > 200);
    assert.ok(edition.threadX.length >= 2);
    assert.ok(edition.threadX.every((post) => [...post].length <= 280));
  }
});

test('le SVG, le CSV et les textes sont générés depuis la même édition', () => {
  const edition = latestWeeklyEdition();
  const svg = buildWeeklyChartSvg(edition);
  const csv = buildWeeklyCsv(edition);
  const citation = buildWeeklyCitationText(edition);
  const linkedin = buildWeeklyLinkedInText(edition);
  const thread = buildWeeklyThreadText(edition);

  assert.match(svg, /<svg[^>]+viewBox="0 0 1200 700"/);
  assert.match(svg, /NE PAS ADDITIONNER/);
  assert.match(svg, /Source :/);
  assert.match(svg, /CC BY 4\.0/);
  assert.doesNotMatch(svg, /<(?:script|image|foreignObject)\b/i);
  assert.equal(csv.trim().split('\n').length, edition.chart.points.length + 1);
  assert.match(csv, /value_usd_billions/);
  assert.match(csv, /false/);
  assert.match(citation, new RegExp(edition.slug));
  assert.match(linkedin, /l0g\.fr/);
  assert.match(thread, /https:\/\/l0g\.fr\/hebdo\//);
});

test('les CTA et les formats journalistes couvrent toutes les surfaces demandées', async () => {
  const [home, article, now, press] = await Promise.all([
    source('src/pages/[...page].astro'),
    source('src/pages/posts/[...slug].astro'),
    source('src/pages/maintenant.astro'),
    source('src/pages/ressources-journalistes.astro'),
  ]);

  for (const page of [home, article, now]) {
    assert.match(page, /WeeklyCta/);
  }
  for (const extension of ['graphique.svg', 'donnees.csv', 'citation.txt', 'linkedin.txt', 'thread-x.txt']) {
    assert.match(press, new RegExp(extension.replace('.', '\\.')));
  }
  assert.match(press, /édition web/);
});

test('la politique de sécurité ne permet aucun envoi de formulaire externe', async () => {
  const [meta, apache] = await Promise.all([
    source('src/components/CspMeta.astro'),
    source('deploy/l0g.fr.apache.conf'),
  ]);
  for (const policy of [meta, apache]) {
    assert.match(policy, /form-action 'self'/);
    assert.doesNotMatch(policy, /form-action 'self' https:/);
  }
});

test('les pages publiques ne reprennent pas le vocabulaire de fabrication', async () => {
  const paths = [
    'src/pages/hebdo.astro',
    'src/pages/hebdo/[slug].astro',
    'src/components/WeeklyCta.astro',
    'src/components/WeeklyIssue.astro',
    'src/pages/ressources-journalistes.astro',
  ];
  const forbidden = [/paquet signature/i, /chaîne éditoriale/i, /seuil opératoire/i, /l’hebdo devient un produit/i, /édition e-mail/i];
  for (const path of paths) {
    const text = await source(path);
    for (const pattern of forbidden) assert.doesNotMatch(text, pattern, path);
  }
});

test('les nouveaux composants éditoriaux respectent l’interdiction du tiret cadratin', async () => {
  const paths = [
    'src/components/WeeklyCta.astro',
    'src/components/WeeklyIssue.astro',
    'src/config/weekly-editions.ts',
    'src/lib/weekly-package.ts',
    'src/pages/hebdo.astro',
    'src/pages/hebdo/[slug].astro',
  ];
  for (const path of paths) assert.doesNotMatch(await source(path), /—/, path);
});
