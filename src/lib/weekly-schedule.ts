export const WEEKLY_AUTOMATION = {
  schema: 1,
  firstEditionDate: '2026-08-09',
  firstIssue: 2,
  timeZone: 'Europe/Paris',
  time: '08:30',
} as const;

const WEEKDAYS_FROM_SUNDAY: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function assertDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError(`Date hebdomadaire invalide : ${value}`);
  }
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new TypeError(`Date hebdomadaire invalide : ${value}`);
  }
}

export function addCalendarDays(value: string, days: number) {
  assertDateOnly(value);
  if (!Number.isInteger(days)) throw new TypeError('Le décalage doit être un nombre entier de jours.');
  const date = new Date(`${value}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function parisParts(value: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: WEEKLY_AUTOMATION.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(value);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function parisOffsetForDate(dateOnly: string) {
  assertDateOnly(dateOnly);
  const noon = new Date(`${dateOnly}T12:00:00.000Z`);
  const zone = new Intl.DateTimeFormat('en-US', {
    timeZone: WEEKLY_AUTOMATION.timeZone,
    timeZoneName: 'longOffset',
  }).formatToParts(noon).find((part) => part.type === 'timeZoneName')?.value;
  const match = zone?.match(/^GMT([+-]\d{2}:\d{2})$/);
  if (!match) throw new Error(`Décalage Europe/Paris introuvable pour ${dateOnly}.`);
  return match[1];
}

export function weeklyPublishedAt(dateOnly: string) {
  return `${dateOnly}T${WEEKLY_AUTOMATION.time}:00${parisOffsetForDate(dateOnly)}`;
}

export function latestDueWeeklyDate(asOf: string | Date = new Date()) {
  const instant = asOf instanceof Date ? new Date(asOf) : new Date(asOf);
  if (Number.isNaN(instant.getTime())) throw new TypeError(`Instant hebdomadaire invalide : ${String(asOf)}`);
  const parts = parisParts(instant);
  const localDate = `${parts.year}-${parts.month}-${parts.day}`;
  const weekday = WEEKDAYS_FROM_SUNDAY[parts.weekday];
  if (weekday === undefined) throw new Error(`Jour Europe/Paris inattendu : ${parts.weekday}`);

  let candidate = addCalendarDays(localDate, -weekday);
  const localMinutes = Number(parts.hour) * 60 + Number(parts.minute);
  const scheduledMinutes = 8 * 60 + 30;
  if (weekday === 0 && localMinutes < scheduledMinutes) candidate = addCalendarDays(candidate, -7);
  return candidate;
}

export function weeklyDatesBetween(firstDate: string, lastDate: string) {
  assertDateOnly(firstDate);
  assertDateOnly(lastDate);
  if (firstDate > lastDate) return [];
  const dates: string[] = [];
  for (let value = firstDate; value <= lastDate; value = addCalendarDays(value, 7)) {
    dates.push(value);
    if (dates.length > 5200) throw new Error('Plage hebdomadaire anormalement longue.');
  }
  if (dates.at(-1) !== lastDate) {
    throw new Error(`${lastDate} ne respecte pas la cadence de sept jours depuis ${firstDate}.`);
  }
  return dates;
}

export function parisDateOnly(value: string | Date) {
  const instant = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(instant.getTime())) throw new TypeError(`Date de publication invalide : ${String(value)}`);
  const parts = parisParts(instant);
  return `${parts.year}-${parts.month}-${parts.day}`;
}
