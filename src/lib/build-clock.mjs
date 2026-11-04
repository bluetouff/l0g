// One instant for cache keys and server-rendered relative dates. CI already
// supplies L0G_BUILD_TIMESTAMP; ordinary local builds freeze their start time.
const timestamp = process.env.L0G_BUILD_TIMESTAMP;
const instant = timestamp ? new Date(timestamp) : new Date();
if (!Number.isFinite(instant.getTime()) || (timestamp && (
  !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(timestamp)
  || instant.toISOString().replace('.000Z', 'Z') !== timestamp.replace('.000Z', 'Z')
))) throw new Error('Invalid L0G_BUILD_TIMESTAMP');

export function buildDate() {
  return new Date(instant.getTime());
}

export function buildDateKey(dates = [], now = buildDate()) {
  return {
    utcDay: now.toISOString().slice(0, 10),
    parisDay: new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now),
    localYear: now.getFullYear(),
    elapsedDays: dates.map(date => Math.max(0, Math.floor((now.getTime() - new Date(date).getTime()) / 86_400_000))),
  };
}
