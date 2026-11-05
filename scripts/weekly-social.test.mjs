import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readWeeklyIllustrations } from './generate-weekly-social.mjs';
import { weeklyCoverImage } from '../src/lib/weekly-presentation.ts';
import { weeklyEditions, latestWeeklyEdition } from '../src/config/weekly-editions.ts';
import { weeklySocialCard, readWeeklyIllustration } from '../src/lib/weekly-social.ts';
import { OG } from './og-kit.mjs';
import { renderWeeklySocialSvg, renderWeeklySocialPng } from './weekly-social-card.mjs';

const illustrations = await readWeeklyIllustrations();
const cardFor = (edition) => weeklySocialCard(edition, weeklyCoverImage(edition, illustrations));
const latest = latestWeeklyEdition();
const future = {
  ...latest,
  slug: '2026-11-08',
  issue: 15,
  publishedAt: '2026-11-08T08:30:00+01:00',
  editorial: undefined,
  analysis: {
    ...latest.analysis,
    title: 'Le financement des infrastructures d’intelligence artificielle : engagements des clients, contrats de location, garanties des fournisseurs et échéances des prêteurs dans les comptes des entreprises',
  },
};

test('les archives et les futures éditions disposent chacune d’une carte propre', () => {
  assert.ok(weeklyEditions.length >= 14);
  const cards = [...weeklyEditions, future].map(cardFor);
  assert.equal(new Set(cards.map(({ image }) => image)).size, cards.length);
  for (const [index, card] of cards.entries()) {
    assert.match(card.image, /^\/og\/hebdo\/[a-z0-9-]+-[a-f0-9]{12}\.png$/);
    assert.ok(card.title.length > 0);
    assert.ok(card.alt.includes(card.title));
    assert.ok(card.alt.includes(card.dateLabel));
    assert.equal(card.issueLabel, `N° ${String(index + 1).padStart(2, '0')}`);
    assert.doesNotMatch(card.title, /\bce\s+qu(?:e|i|[’'](?:on|il))\b/i);
  }
  assert.equal(cards.at(-1).title, future.analysis.title);
  assert.equal(weeklySocialCard(weeklyEditions.find(({ slug }) => slug === '2026-10-18')).title, 'Le calendrier de la liquidité');
});

test('la date de parution suit Paris, le changement d’heure et le premier du mois', () => {
  assert.equal(weeklySocialCard({ ...future, publishedAt: '2026-10-31T23:30:00Z' }).dateLabel, '1er novembre 2026');
  assert.equal(weeklySocialCard({ ...future, publishedAt: '2026-08-31T22:30:00Z' }).dateLabel, '1er septembre 2026');
  assert.equal(weeklySocialCard({ ...future, publishedAt: '2026-11-01T23:30:00Z' }).dateLabel, '2 novembre 2026');
});

test('les URL restent stables et changent avec le contenu visible', () => {
  const original = weeklySocialCard(future);
  assert.deepEqual(weeklySocialCard(structuredClone(future)), original);
  assert.notEqual(weeklySocialCard({ ...future, analysis: { ...future.analysis, title: 'Une nouvelle lecture des échéances' } }).image, original.image);
  assert.notEqual(weeklySocialCard({ ...future, issue: 16 }).image, original.image);
  assert.notEqual(weeklySocialCard({ ...future, publishedAt: '2026-11-15T08:30:00+01:00' }).image, original.image);
  assert.equal(weeklySocialCard({ ...future, description: 'Une modification qui ne change pas la couverture.' }).image, original.image);
});

test('les entrées invalides échouent avant de construire un chemin ou une carte', () => {
  for (const value of [null, undefined, [], '2026-11-08']) assert.throws(() => weeklySocialCard(value), TypeError);
  for (const slug of ['', '..', '../escape', '2026-11-08/escape', '2026%2f11', '/absolute', 'x\\escape', 'x\u0000', 'a'.repeat(121)]) {
    assert.throws(() => weeklySocialCard({ ...future, slug }), /slug invalide/);
  }
  for (const issue of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '15']) {
    assert.throws(() => weeklySocialCard({ ...future, issue }), /numéro invalide/);
  }
  for (const publishedAt of ['', 'demain', '2026-02-31T08:30:00+01:00', '2026-13-01T08:30:00Z', '2026-11-08']) {
    assert.throws(() => weeklySocialCard({ ...future, publishedAt }), /date de publication invalide/);
  }
  for (const title of ['', '   ', '\u0000titre', 'x'.repeat(501)]) {
    assert.throws(() => weeklySocialCard({ ...future, analysis: { ...future.analysis, title } }), /titre invalide/);
  }
});

test('les titres complets des archives et d’une future édition restent lisibles dans la carte', async (t) => {
  for (const edition of [...weeklyEditions, future]) {
    await t.test(edition.slug, async () => {
      const card = cardFor(edition);
      const nodes = [];
      await renderWeeklySocialSvg(card, { onNodeDetected: (node) => nodes.push(node) });
      for (const node of nodes) {
        const bounds = [node.left, node.top, node.width, node.height];
        assert.ok(bounds.every(Number.isFinite), 'les dimensions rendues sont finies');
        assert.ok(node.left >= 0 && node.top >= 0 && node.width >= 0 && node.height >= 0);
        assert.ok(node.left + node.width <= OG.width + 0.01 && node.top + node.height <= OG.height + 0.01,
          `débordement ${node.textContent ?? node.type} : ${bounds.join(', ')}`);
      }
      const title = nodes.find(({ textContent }) => textContent === card.title);
      const footer = nodes.find(({ textContent }) => textContent === 'l0g.fr / hebdo');
      assert.ok(title, 'le titre intégral est composé');
      assert.ok(footer, 'la signature reste présente');
      assert.ok(title.top >= 300 && title.left >= 50);
      assert.ok(title.left + title.width <= 620, 'le titre reste dans la colonne sombre');
      assert.ok(footer.top - title.top - title.height >= 24,
        `le titre doit garder 24px avant la signature : ${footer.top - title.top - title.height}px`);
      assert.equal(title.props.style.fontWeight ?? 400, 400, 'le titrage garde une graisse normale');
      for (const text of ['L’Hebdo', card.issueLabel, card.dateLabel]) {
        assert.ok(nodes.some(({ textContent }) => textContent === text), `repère de collection absent : ${text}`);
      }
    });
  }
});

test('l’OG de la dernière édition est déterministe, en 1200×630 et assez légère pour le partage', async () => {
  const card = cardFor(latest);
  const first = await renderWeeklySocialPng(card);
  const second = await renderWeeklySocialPng(card);
  assert.deepEqual(first, second);
  const metadata = await sharp(first).metadata();
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  assert.ok(first.length < 700_000, `carte trop lourde : ${first.length} octets`);
  // The charcoal field remains subdued; its masthead, issue and date
  // distinguish the weekly collection from analysis cards.
  const { data, info } = await sharp(first).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const offset = (20 * info.width + 20) * info.channels;
  assert.ok(data[offset] < 70 && data[offset + 1] < 70 && data[offset + 2] < 70);
});

test('un titre impossible à composer provoque un échec explicite sans carte tronquée', async () => {
  for (const title of ['Financement '.repeat(50).slice(0, 499) + 'x', 'W'.repeat(500)]) {
    const card = weeklySocialCard({
      ...future,
      analysis: { ...future.analysis, title },
    });
    assert.equal(card.title.length, 500);
    await assert.rejects(renderWeeklySocialSvg(card), /composition trop longue/);
    await assert.rejects(renderWeeklySocialPng(card), /composition trop longue/);
  }
});


test('les trois premiers numéros ont une illustration réelle et tous les numéros partagent la couverture web', async () => {
  const seen = new Set();
  for (const edition of weeklyEditions) {
    const cover = weeklyCoverImage(edition, illustrations);
    assert.ok(cover, `${edition.slug}: illustration absente`);
    const card = cardFor(edition);
    assert.equal(card.illustration, cover);
    assert.match(card.artworkHash, /^[a-f0-9]{64}$/);
    seen.add(cover);
  }
  assert.equal(seen.size, weeklyEditions.length);
  for (const edition of weeklyEditions.slice(0, 3)) {
    const bytes = readWeeklyIllustration(cardFor(edition).illustration);
    const meta = await sharp(bytes).metadata();
    assert.deepEqual([meta.width, meta.height], [1200, 630]);
    assert.ok(bytes.length < 250_000);
  }
});

test('une nouvelle illustration renouvelle l’URL et une mutation pendant le rendu bloque la carte', async () => {
  const first = cardFor(latest);
  const second = weeklySocialCard(latest, cardFor(weeklyEditions[0]).illustration);
  assert.notEqual(first.image, second.image);
  await assert.rejects(renderWeeklySocialPng({ ...first, artworkHash: '0'.repeat(64) }), /modifiée après/);
});

test('la lecture d’illustration exclut les URL distantes, les traversées et les liens hors du dossier public', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'weekly-og-input-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const publicRoot = join(directory, 'public');
  await mkdir(join(publicRoot, 'illustrations'), { recursive: true });
  await writeFile(join(directory, 'outside.jpg'), 'test fixture');
  await symlink(join(directory, 'outside.jpg'), join(publicRoot, 'illustrations', 'outside.jpg'));
  await writeFile(join(publicRoot, 'illustrations', 'empty.jpg'), '');
  await writeFile(join(publicRoot, 'illustrations', 'fake.jpg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  await writeFile(join(publicRoot, 'illustrations', 'large.jpg'), Buffer.alloc(8_000_001));
  for (const src of ['https://example.com/x.jpg', '/illustrations/../outside.jpg', '/illustrations/x.svg', '/illustrations/a.jpg?x=1']) {
    assert.throws(() => readWeeklyIllustration(src, publicRoot), /illustration locale invalide/);
  }
  assert.throws(() => readWeeklyIllustration('/illustrations/outside.jpg', publicRoot), /hors du dossier public/);
  assert.throws(() => readWeeklyIllustration('/illustrations/empty.jpg', publicRoot), /hors budget/);
  assert.throws(() => readWeeklyIllustration('/illustrations/missing.jpg', publicRoot), /ENOENT/);
  assert.throws(() => readWeeklyIllustration('/illustrations/fake.jpg', publicRoot), /format raster invalide/);
  assert.throws(() => readWeeklyIllustration('/illustrations/large.jpg', publicRoot), /hors budget/);
});


test('une future édition sans illustration produit une couverture typographique complète', async () => {
  const card = weeklySocialCard(future);
  const png = await renderWeeklySocialPng(card);
  assert.equal(card.illustration, undefined);
  const meta = await sharp(png).metadata();
  assert.deepEqual([meta.width, meta.height], [1200, 630]);
});
