// Mesure locale uniquement : aucun serveur HTTP ni appel à la production.
// L0G_DATA_DIR=/chemin/vers/dist node mcp-server/benchmark-cache.mjs [server.mjs]
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

if (!process.env.L0G_DATA_DIR) throw new Error('Définir L0G_DATA_DIR vers un corpus local construit.');
const entrypoint = process.argv[2]
  ? pathToFileURL(resolve(process.argv[2]))
  : new URL('./server.mjs', import.meta.url);
const { loadData } = await import(entrypoint);
const concurrentReaders = 8;
const start = performance.now();
const snapshots = await Promise.all(Array.from({ length: concurrentReaders }, () => loadData()));
console.log(JSON.stringify({
  node: process.version,
  concurrentReaders,
  distinctSnapshots: new Set(snapshots).size,
  coldLoadMs: performance.now() - start,
  rssMiB: process.memoryUsage().rss / 1048576,
}, null, 2));
