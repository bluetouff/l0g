import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflowsDir = join(root, '.github', 'workflows');
const rootPackage = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));

function requireCondition(condition, message) {
  if (!condition) throw new Error(`CI policy: ${message}`);
}

const workflowNames = (await readdir(workflowsDir))
  .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
  .sort();
const workflows = new Map(
  await Promise.all(
    workflowNames.map(async (name) => [
      name,
      await readFile(join(workflowsDir, name), 'utf8'),
    ]),
  ),
);

for (const [name, source] of workflows) {
  const actionRefs = [...source.matchAll(/\buses:\s+([^\s#]+)/g)].map((match) => match[1]);
  const mutableRefs = actionRefs.filter((reference) => !/@[0-9a-f]{40}$/i.test(reference));
  requireCondition(
    mutableRefs.length === 0,
    `${name}: actions non épinglées sur un SHA immuable (${mutableRefs.join(', ')})`,
  );

  const checkoutCount = actionRefs.filter((reference) => reference.startsWith('actions/checkout@')).length;
  const hardenedCheckoutCount = (source.match(/persist-credentials:\s*false/g) || []).length;
  requireCondition(
    checkoutCount === hardenedCheckoutCount,
    `${name}: chaque checkout doit désactiver la persistance des credentials`,
  );
}

const scheduled = [...workflows]
  .filter(([, source]) => /^\s*schedule:\s*$/m.test(source) || /^\s*cron:\s*/m.test(source))
  .map(([name]) => name);
requireCondition(
  scheduled.length === 1 && scheduled[0] === 'weekly-edition.yml',
  `seul weekly-edition.yml peut être récurrent, trouvé dans ${scheduled.join(', ') || 'aucun'}`,
);

const weekly = workflows.get('weekly-edition.yml') || '';
requireCondition(weekly.includes("cron: '30 6,7 * * 0'"), 'la double fenêtre UTC de l’Hebdo doit couvrir le changement d’heure parisien');
requireCondition(weekly.includes("if: github.repository == 'bluetouff/l0g'"), 'le cron Hebdo doit être borné au dépôt canonique');
requireCondition(weekly.includes('timeout-minutes: 10'), 'le cron Hebdo doit conserver sa limite de 10 minutes');
requireCondition(weekly.includes('contents: write') && weekly.includes('actions: write'), 'le cron Hebdo doit déclarer ses deux permissions minimales');
requireCondition(weekly.includes('npm run weekly:update'), 'le cron Hebdo doit utiliser le générateur versionné');
requireCondition(weekly.includes('npm run test:hebdo') && weekly.includes('npm run test:secrets'), 'le cron Hebdo doit valider le produit et les secrets avant commit');
requireCondition(weekly.includes('git add -- src/config/weekly-editions.generated.json'), 'le cron Hebdo ne doit indexer que le registre généré');
requireCondition(weekly.includes('gh workflow run build.yml') && weekly.includes('--ref main'), 'le cron Hebdo doit déclencher la chaîne de release signée');
requireCondition(!weekly.includes('pull_request_target:'), 'le cron Hebdo ne doit pas être exposé à pull_request_target');
requireCondition(rootPackage.scripts?.['weekly:update']?.includes('generate-weekly-editions.mjs --write'), 'le script weekly:update doit rester explicite');

const build = workflows.get('build.yml') || '';
requireCondition(build.includes('branches: [main]'), 'le build doit rester lié à main');
requireCondition(build.includes('workflow_dispatch:'), 'le build manuel doit rester disponible');
requireCondition(build.includes('timeout-minutes: 15'), 'le build doit conserver sa limite de 15 minutes');
requireCondition(
  build.includes('mcp-server/package-lock.json'),
  'le cache npm doit couvrir le lockfile MCP',
);
requireCondition(
  build.includes('npm run test:ci-policy'),
  'le build doit vérifier la politique CI avant publication',
);
requireCondition(
  build.includes('npm run test:dependencies'),
  'le build doit refuser les dépendances vulnérables avant publication',
);
requireCondition(
  build.includes('npm run build') && rootPackage.scripts?.build?.includes('npm run test:secrets'),
  'le build doit analyser les secrets accidentels dans les sources et artefacts',
);
const productionInstalls = build
  .split('\n')
  .filter((line) => line.includes('npm ci') && line.includes('--omit=dev'));
requireCondition(
  productionInstalls.length === 1,
  `une seule installation MCP production est attendue, trouvé ${productionInstalls.length}`,
);

const codeql = workflows.get('codeql.yml') || '';
requireCondition(codeql.includes('pull_request:'), 'CodeQL doit rester actif sur les pull requests');
requireCondition(codeql.includes('push:'), 'CodeQL doit rester actif sur les changements de code');
requireCondition(
  codeql.includes('queries: security-extended'),
  'la suite CodeQL security-extended doit rester active',
);
requireCondition(
  codeql.includes('cancel-in-progress: true'),
  'CodeQL doit annuler les analyses devenues obsolètes',
);

const risk = workflows.get('risk-producers.yml') || '';
requireCondition(risk.includes('workflow_dispatch:'), 'le contrôle risque manuel doit rester disponible');
requireCondition(risk.includes('paths:'), 'le contrôle risque doit rester lié à ses fichiers métier');
requireCondition(
  risk.includes('cancel-in-progress: true'),
  'les contrôles risque obsolètes doivent être annulés',
);
requireCondition(
  /Probe deployed producers[\s\S]*?if: github\.event_name == 'workflow_dispatch'[\s\S]*?node scripts\/check-risk-producers\.mjs/.test(risk),
  'le push doit valider le contrat sans sonder une production pas encore activée',
);

const mcpRelease = workflows.get('publish-mcp.yml') || '';
requireCondition(
  mcpRelease.includes('npm run test:dependencies'),
  'la release MCP doit réauditer ses dépendances avant publication',
);

process.stdout.write(
  `CI policy OK: ${workflowNames.length} workflows, un cron Hebdo borné, contrôles sécurité et métier ciblés.\n`,
);
