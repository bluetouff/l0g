import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflowsDir = join(root, '.github', 'workflows');

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

const scheduled = [...workflows]
  .filter(([, source]) => /^\s*schedule:\s*$/m.test(source) || /^\s*cron:\s*/m.test(source))
  .map(([name]) => name);
requireCondition(
  scheduled.length === 0,
  `aucun workflow récurrent autorisé, trouvé dans ${scheduled.join(', ')}`,
);

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

process.stdout.write(
  `CI policy OK: ${workflowNames.length} workflows, aucun cron, contrôles sécurité et métier ciblés.\n`,
);
