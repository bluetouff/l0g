// One instant for cache keys and server-rendered build timestamps. CI already
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
