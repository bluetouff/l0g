import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  WEEKLY_SCHEDULE,
  latestWeeklyEdition,
  manualWeeklyEditions,
  weeklyEditions,
  weeklySitemapLastmods,
} from '../src/config/weekly-editions.ts';
import { createAutomatedWeeklyEdition } from '../src/lib/weekly-generation.ts';
import {
  WEEKLY_AUTOMATION,
  latestDueWeeklyDate,
  weeklyDatesBetween,
  weeklyPublishedAt,
} from '../src/lib/weekly-schedule.ts';
import {
  buildWeeklyChartSvg,
  buildWeeklyCitationText,
  buildWeeklyCsv,
  buildWeeklyLinkedInText,
  buildWeeklyThreadText,
  weeklyChartDimensions,
} from '../src/lib/weekly-package.ts';

const root = new URL('../', import.meta.url);

function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('le contrat hebdomadaire possède une édition à chaque échéance due', async () => {
  assert.deepEqual(WEEKLY_SCHEDULE, {
    weekday: 'dimanche',
    weekdayIso: 7,
    time: '08:30',
    timeZone: 'Europe/Paris',
    label: 'Nouvelle édition chaque dimanche à 08 h 30, heure de Paris',
  });
  const automated = weeklyEditions.filter((edition) => edition.automation);
  const asOf = process.env.L0G_BUILD_TIMESTAMP || new Date().toISOString();
  const dueDate = latestDueWeeklyDate(asOf);
  if (dueDate >= WEEKLY_AUTOMATION.firstEditionDate) {
    assert.ok(automated.length > 0, `aucune édition automatique alors que ${dueDate} est due`);
    assert.ok(automated.at(-1).slug >= dueDate, `dernière édition ${automated.at(-1).slug}, échéance ${dueDate}`);
  }

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

test('le calcul de cadence couvre Paris et le changement d’heure', () => {
  assert.equal(latestDueWeeklyDate('2026-08-16T06:29:59.000Z'), '2026-08-09');
  assert.equal(latestDueWeeklyDate('2026-08-16T06:30:00.000Z'), '2026-08-16');
  assert.equal(latestDueWeeklyDate('2026-10-25T07:29:59.000Z'), '2026-10-18');
  assert.equal(latestDueWeeklyDate('2026-10-25T07:30:00.000Z'), '2026-10-25');
  assert.equal(weeklyPublishedAt('2026-08-16'), '2026-08-16T08:30:00+02:00');
  assert.equal(weeklyPublishedAt('2026-10-25'), '2026-10-25T08:30:00+01:00');
  assert.deepEqual(
    weeklyDatesBetween('2026-08-09', '2026-08-23'),
    ['2026-08-09', '2026-08-16', '2026-08-23'],
  );
});

test('chaque édition possède tous ses formats et une provenance cohérente', () => {
  assert.ok(weeklyEditions.length > 1);
  assert.equal(new Set(weeklyEditions.map((edition) => edition.issue)).size, weeklyEditions.length);
  assert.equal(new Set(weeklyEditions.map((edition) => edition.slug)).size, weeklyEditions.length);

  for (const [index, edition] of weeklyEditions.entries()) {
    assert.equal(edition.issue, index + 1);
    assert.ok(edition.analysis.href.startsWith('/'));
    assert.ok(edition.sources.length >= 1);
    assert.ok(edition.chart.sourceUrl.startsWith('https://'));
    assert.ok(edition.chart.points.length >= 1);
    assert.ok(edition.quote.length > 80);
    assert.ok(edition.linkedin.length > 200);
    assert.ok(edition.threadX.length >= 2);
    assert.ok(edition.threadX.every((post) => [...post].length <= 280));
    if (edition.automation) {
      assert.ok(edition.chart.points.every((point) => point.additive === true));
      assert.equal(edition.automation.strategy, 'published-metadata-v1');
    } else {
      assert.ok(edition.chart.points.every((point) => point.additive === false));
      assert.ok(edition.sources.some((item) => item.href === edition.chart.sourceUrl));
    }
  }
});

test('l’édition manquante du 9 août est figée et auditable', () => {
  const edition = weeklyEditions.find((item) => item.slug === '2026-08-09');
  assert.ok(edition);
  assert.equal(edition.issue, 2);
  assert.equal(edition.number.value, '15');
  assert.equal(edition.analysis.href, '/posts/softbank-openai-risque-liquidite/');
  assert.equal(edition.includedAnalyses.length, 15);
  assert.equal(edition.sources.length, 15);
  assert.equal(edition.chart.points.reduce((total, point) => total + point.value, 0), 15);
  assert.equal(edition.automation.windowStart, '2026-08-02T08:30:00+02:00');
  assert.equal(edition.automation.windowEnd, '2026-08-09T08:30:00+02:00');
});

test('le générateur choisit le dernier focus structuré sans inventer de contenu', () => {
  const structured = {
    id: 'analyse-structuree',
    title: 'Analyse structurée',
    description: 'Description vérifiée et déjà publiée.',
    pubDate: '2026-08-14T10:00:00+02:00',
    quickTake: {
      fact: 'Fait structuré suffisamment long pour rester attribuable sans ajout automatique.',
      importance: 'Importance structurée suffisamment longue pour être reprise sans reformulation.',
      uncertainty: 'Limite structurée suffisamment longue pour préserver l’incertitude publiée.',
    },
  };
  const later = {
    id: 'analyse-plus-recente',
    title: 'Analyse plus récente',
    description: 'Description plus récente mais dépourvue de fiche structurée complète.',
    pubDate: '2026-08-15T10:00:00+02:00',
  };
  const edition = createAutomatedWeeklyEdition({
    issue: 3,
    editionDate: '2026-08-16',
    generatedAt: '2026-08-16T06:35:00.000Z',
    posts: [later, structured],
  });
  assert.equal(edition.analysis.href, '/posts/analyse-structuree/');
  assert.equal(edition.lead, structured.quickTake.fact);
  assert.equal(edition.mechanism, structured.quickTake.importance);
  assert.equal(edition.test, structured.quickTake.uncertainty);
  assert.equal(edition.number.value, '2');
  assert.ok(edition.threadX.every((post) => [...post].length <= 280));
});

test('le SVG, le CSV et les textes sont générés depuis la même édition', () => {
  const edition = latestWeeklyEdition();
  const dimensions = weeklyChartDimensions(edition);
  const svg = buildWeeklyChartSvg(edition);
  const csv = buildWeeklyCsv(edition);
  const citation = buildWeeklyCitationText(edition);
  const linkedin = buildWeeklyLinkedInText(edition);
  const thread = buildWeeklyThreadText(edition);

  assert.match(svg, new RegExp(`<svg[^>]+viewBox="0 0 ${dimensions.width} ${dimensions.height}"`));
  assert.match(svg, /COMPTER, PAS CLASSER/);
  assert.match(svg, /Source :/);
  assert.match(svg, /CC BY 4\.0/);
  assert.doesNotMatch(svg, /<(?:script|image|foreignObject)\b/i);
  assert.equal(csv.trim().split('\n').length, edition.chart.points.length + 1);
  assert.match(csv, /published_analyses/);
  assert.match(csv, /true/);
  assert.match(citation, new RegExp(edition.slug));
  assert.match(linkedin, /l0g\.fr/);
  assert.match(thread, /https:\/\/l0g\.fr\/hebdo\//);

  const manual = manualWeeklyEditions[0];
  assert.match(buildWeeklyChartSvg(manual), /viewBox="0 0 1200 700"/);
  assert.match(buildWeeklyChartSvg(manual), /NE PAS ADDITIONNER/);
  assert.match(buildWeeklyCsv(manual), /value_usd_billions/);
});

test('les CTA, les archives et les formats journalistes couvrent toutes les surfaces', async () => {
  const [home, article, now, press, archive, issue, feed] = await Promise.all([
    source('src/pages/[...page].astro'),
    source('src/pages/posts/[...slug].astro'),
    source('src/pages/maintenant.astro'),
    source('src/pages/ressources-journalistes.astro'),
    source('src/pages/hebdo.astro'),
    source('src/pages/hebdo/[slug].astro'),
    source('src/pages/hebdo/rss.xml.ts'),
  ]);

  for (const page of [home, article, now]) assert.match(page, /WeeklyCta/);
  for (const extension of ['graphique.svg', 'donnees.csv', 'citation.txt', 'linkedin.txt', 'thread-x.txt']) {
    assert.match(press, new RegExp(extension.replace('.', '\\.')));
  }
  assert.match(press, /édition web/);
  assert.match(archive, /\/hebdo\/rss\.xml/);
  assert.match(issue, /rel="prev"/);
  assert.match(issue, /rel="next"/);
  assert.match(feed, /weeklyEditions/);
});

test('le workflow planifié ne peut modifier que le registre figé', async () => {
  const workflow = await source('.github/workflows/weekly-edition.yml');
  assert.match(workflow, /cron: '30 6,7 \* \* 0'/);
  assert.match(workflow, /github\.repository == 'bluetouff\/l0g'/);
  assert.match(workflow, /npm run weekly:update/);
  assert.match(workflow, /test "\$\(git diff --name-only\)" = "src\/config\/weekly-editions\.generated\.json"/);
  assert.match(workflow, /git add -- src\/config\/weekly-editions\.generated\.json/);
  assert.match(workflow, /gh workflow run build\.yml/);
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

test('les composants et éditions de l’Hebdo respectent l’interdiction du tiret cadratin', async () => {
  const paths = [
    'src/components/WeeklyCta.astro',
    'src/components/WeeklyIssue.astro',
    'src/config/weekly-editions.ts',
    'src/config/weekly-editions.generated.json',
    'src/lib/weekly-generation.ts',
    'src/lib/weekly-package.ts',
    'src/lib/weekly-schedule.ts',
    'src/pages/hebdo.astro',
    'src/pages/hebdo/[slug].astro',
  ];
  for (const path of paths) assert.doesNotMatch(await source(path), /\u2014/, path);
});
