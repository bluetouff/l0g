import type { WeeklyEdition } from '../config/weekly-editions.ts';
import {
  addCalendarDays,
  parisDateOnly,
  weeklyPublishedAt,
} from './weekly-schedule.ts';

export type WeeklyPostInput = {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  quickTake?: {
    fact: string;
    importance: string;
    uncertainty: string;
  };
};

type AutomatedEditionInput = {
  issue: number;
  editionDate: string;
  generatedAt: string;
  posts: WeeklyPostInput[];
};

const frenchDate = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Paris',
});

const frenchDayMonth = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const frenchChartDay = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
});

function formatDateOnly(dateOnly: string) {
  return frenchDayMonth.format(new Date(`${dateOnly}T12:00:00.000Z`));
}

function formatPublishedAt(value: string) {
  return frenchDate.format(new Date(value));
}

function assertPost(post: WeeklyPostInput) {
  if (!post.id || !post.title || !post.description || !post.pubDate) {
    throw new TypeError('Une analyse destinée à l’Hebdo possède des métadonnées incomplètes.');
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.id)) {
    throw new TypeError(`Identifiant d’analyse invalide : ${post.id}`);
  }
  if (Number.isNaN(Date.parse(post.pubDate))) {
    throw new TypeError(`Date de publication invalide pour ${post.id}.`);
  }
  if (post.quickTake) {
    for (const value of Object.values(post.quickTake)) {
      if (typeof value !== 'string' || value.trim().length < 20) {
        throw new TypeError(`Fiche structurée invalide pour ${post.id}.`);
      }
    }
  }
}

function splitWords(value: string, maxLength: number) {
  const words = value.trim().split(/\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const word of words) {
    if ([...word].length > maxLength) {
      throw new Error('Un mot dépasse la taille maximale d’un message X.');
    }
    const candidate = current ? `${current} ${word}` : word;
    if ([...candidate].length <= maxLength) {
      current = candidate;
      continue;
    }
    chunks.push(current);
    current = word;
  }
  if (current) chunks.push(current);
  return chunks;
}

function splitWithoutRewriting(value: string, maxLength: number) {
  const sentences = [...new Intl.Segmenter('fr', { granularity: 'sentence' }).segment(value.trim())]
    .map(({ segment }) => segment.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if ([...sentence].length > maxLength) {
      if (current) chunks.push(current);
      chunks.push(...splitWords(sentence, maxLength));
      current = '';
      continue;
    }
    const candidate = current ? `${current} ${sentence}` : sentence;
    if ([...candidate].length <= maxLength) current = candidate;
    else {
      chunks.push(current);
      current = sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function buildThread(parts: string[]) {
  const chunks = parts.flatMap((part) => splitWithoutRewriting(part, 266));
  const total = chunks.length;
  return chunks.map((chunk, index) => `${index + 1}/${total} ${chunk}`);
}

function chartPoints(posts: WeeklyPostInput[], startDate: string, endDate: string) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    const date = parisDateOnly(post.pubDate);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  const points = [];
  for (let date = startDate; date <= endDate; date = addCalendarDays(date, 1)) {
    const value = counts.get(date) ?? 0;
    const label = frenchChartDay.format(new Date(`${date}T12:00:00.000Z`)).replace('.', '');
    points.push({
      label,
      shortLabel: label,
      value,
      valueLabel: String(value),
      nature: value === 1 ? 'analyse publiée' : 'analyses publiées',
      scope: date,
      tone: (points.length % 3 === 0 ? 'signal' : points.length % 3 === 1 ? 'accent' : 'amber') as 'signal' | 'accent' | 'amber',
      additive: true,
    });
  }
  return points;
}

export function createAutomatedWeeklyEdition({
  issue,
  editionDate,
  generatedAt,
  posts,
}: AutomatedEditionInput): WeeklyEdition {
  if (!Number.isInteger(issue) || issue < 1) throw new TypeError('Numéro d’édition invalide.');
  if (Number.isNaN(Date.parse(generatedAt))) throw new TypeError('Date de génération invalide.');
  for (const post of posts) assertPost(post);

  const windowStartDate = addCalendarDays(editionDate, -7);
  const windowStart = weeklyPublishedAt(windowStartDate);
  const windowEnd = weeklyPublishedAt(editionDate);
  const selected = posts
    .filter((post) => Date.parse(post.pubDate) > Date.parse(windowStart) && Date.parse(post.pubDate) <= Date.parse(windowEnd))
    .sort((left, right) => Date.parse(right.pubDate) - Date.parse(left.pubDate) || left.id.localeCompare(right.id));
  const structured = selected.filter((post) => post.quickTake);
  const focus = structured[0] ?? selected[0];
  const count = selected.length;
  const countLabel = count === 1 ? 'analyse publiée' : 'analyses publiées';
  const issueUrl = `https://l0g.fr/hebdo/${editionDate}/`;
  const period = `du ${formatDateOnly(windowStartDate)} à 08 h 30 au ${formatDateOnly(editionDate)} à 08 h 30`;

  const focusTitle = focus?.title ?? 'Aucune nouvelle analyse publiée cette semaine';
  const focusDescription = focus?.description
    ?? 'Cette édition de continuité constate qu’aucune nouvelle analyse non brouillon n’entre dans la fenêtre hebdomadaire.';
  const focusFact = focus?.quickTake?.fact ?? focusDescription;
  const focusImportance = focus?.quickTake?.importance
    ?? 'L’édition conserve néanmoins une URL stable et rend visible l’absence de nouvelle publication.';
  const focusUncertainty = focus?.quickTake?.uncertainty
    ?? 'Aucun fait économique supplémentaire n’est déduit de cette absence de publication.';
  const analysisHref = focus ? `/posts/${focus.id}/` : '/';

  const linkedin = [
    `${count} ${countLabel} sur l0g ${period}.`,
    `Focus structuré : ${focusTitle}.`,
    focusFact,
    `Pourquoi le lire : ${focusImportance}`,
    `Limite à garder : ${focusUncertainty}`,
    `Édition, graphique de cadence, CSV et archives : ${issueUrl}`,
  ].join('\n\n');

  const threadX = buildThread([
    `L’Hebdo l0g du ${formatDateOnly(editionDate)} compte ${count} ${countLabel}. Focus : ${focusTitle}.`,
    focusFact,
    `Pourquoi le lire : ${focusImportance}`,
    `Limite : ${focusUncertainty}`,
    `Édition, graphique, CSV et analyses : ${issueUrl}`,
  ]);

  const sources = selected.length > 0
    ? selected.map((post) => ({
        label: post.title,
        href: `/posts/${post.id}/`,
        role: `Analyse publiée le ${formatPublishedAt(post.pubDate)} ; sources, méthode et limites dans le dossier.`,
      }))
    : [{
        label: 'Index public des analyses l0g',
        href: '/',
        role: 'Source du constat d’absence de nouvelle analyse dans la fenêtre.',
      }];

  return {
    issue,
    slug: editionDate,
    publishedAt: windowEnd,
    title: `L’Hebdo du ${formatDateOnly(editionDate)}. ${focusTitle}`,
    description: `Édition automatisée du ${formatDateOnly(editionDate)} : ${count} ${countLabel}, avec un focus construit uniquement à partir de métadonnées éditoriales déjà publiées.`,
    analysis: {
      title: focusTitle,
      href: analysisHref,
      update: focusDescription,
    },
    lead: focusFact,
    number: {
      value: String(count),
      label: `${countLabel} ${period}`,
      context: 'Décompte automatique des articles publics non brouillons. Il ne mesure ni l’importance des sujets ni leur audience.',
    },
    mechanism: focusImportance,
    test: focusUncertainty,
    limits: [
      'Le focus est le dernier article de la fenêtre possédant une fiche structurée ; ce choix ne constitue pas un classement d’importance.',
      'L’édition réutilise uniquement des métadonnées éditoriales déjà publiées et n’ajoute aucun chiffre économique.',
      'Le graphique mesure une cadence de publication, pas la portée économique des sujets.',
    ],
    chart: {
      title: `${count} ${countLabel} en sept jours`,
      subtitle: `${period}, heure de Paris.`,
      note: 'Le graphique compte les publications. Il ne classe ni les sujets ni leur importance.',
      observationDate: editionDate,
      sourceLabel: 'l0g.fr, métadonnées éditoriales publiques',
      sourceUrl: 'https://l0g.fr/',
      csvValueColumn: 'published_analyses',
      calloutLabel: 'COMPTER, PAS CLASSER',
      points: chartPoints(selected, windowStartDate, editionDate),
    },
    quote: focusFact,
    linkedin,
    threadX,
    sources,
    sourcesEyebrow: '// analyses et leurs sources',
    includedAnalyses: selected.map((post) => ({
      title: post.title,
      href: `/posts/${post.id}/`,
      publishedAt: post.pubDate,
    })),
    automation: {
      strategy: 'published-metadata-v1',
      generatedAt: new Date(generatedAt).toISOString(),
      windowStart,
      windowEnd,
    },
  };
}
