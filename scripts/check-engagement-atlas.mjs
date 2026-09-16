import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertAtlasDataset } from '../src/lib/engagement-atlas.ts';

const args = process.argv.slice(2);
const proposal = args[0] === '--proposal';
if (args.length && !(proposal && args.length === 2)) {
  console.error('Usage : npm run atlas:check | npm run atlas:check -- --proposal chemin.json');
  process.exit(1);
}
const path = resolve(proposal ? args[1] : 'src/data/engagement-atlas.json');
try {
  if (statSync(path).size > 500_000) throw new Error('Taille excessive');
  const data = JSON.parse(readFileSync(path, 'utf8'));
  assertAtlasDataset(data, proposal);
  console.log(proposal
    ? 'Structure de proposition valide. Aucune approbation éditoriale ni écriture dans le corpus publié.'
    : `Atlas valide : ${data.nodes.length} acteurs et structures, ${data.relations.length} relations, ${data.sources.length} pièces primaires.`);
} catch {
  // Input paths, source URLs and raw JSON may be private; do not print them.
  console.error('Atlas invalide : vérifier schéma, dates, sources, limites et statut de revue. Aucun fichier modifié.');
  process.exitCode = 1;
}
