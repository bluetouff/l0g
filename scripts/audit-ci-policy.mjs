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
  scheduled.length === 2
    && scheduled[0] === 'risk-producers.yml'
    && scheduled[1] === 'weekly-edition.yml',
  `seuls risk-producers.yml et weekly-edition.yml peuvent être récurrents, trouvé dans ${scheduled.join(', ') || 'aucun'}`,
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
requireCondition(
  build.includes('bash deploy/prepare-static-transport.sh release publish')
    && build.includes('release/l0g-site.tar.gz')
    && build.includes('release/l0g-site.tar.gz.sigstore.jsonl'),
  'le transport doit fragmenter la release sans remplacer l’attestation de l’archive entière',
);
requireCondition(build.includes('branches: [main]'), 'le build doit rester lié à main');
requireCondition(build.includes('pull_request:'), 'le vrai build doit valider les pull requests avant fusion');
requireCondition(build.includes('workflow_dispatch:'), 'le build manuel doit rester disponible');
const job = (name) => build.match(new RegExp(`^  ${name}:\\n[\\s\\S]*?(?=^  [a-z][a-z-]*:|$(?![\\s\\S]))`, 'm'))?.[0] || '';
const publicationJob = job('publish');
const buildJob = job('build');
const sourceJob = job('svg-source');
requireCondition(/^    timeout-minutes: 20$/m.test(publicationJob), 'la publication signée doit rester bornée à 20 minutes');
requireCondition(
  build.includes("cancel-in-progress: ${{ github.event_name == 'pull_request' }}"),
  'les validations PR obsolètes doivent être annulées sans interrompre une publication main',
);
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
  build.includes('npm run build:ci') && rootPackage.scripts?.['build:verify']?.includes('npm run test:secrets')
    && rootPackage.scripts?.build?.includes('npm run build:verify')
    && rootPackage.scripts?.['build:ci']?.includes('npm run build:verify'),
  'le build doit analyser les secrets accidentels dans les sources et artefacts',
);
const validatePr = job('validate-pr-build');
requireCondition(
  validatePr.includes("if: github.event_name == 'pull_request'") && validatePr.includes('contents: read') && /^    timeout-minutes: 15$/m.test(validatePr),
  'la validation PR doit être bornée à 15 minutes et en lecture seule',
);
requireCondition(
  validatePr.includes('ref: black-box-archive') && validatePr.includes('persist-credentials: false'),
  'la validation PR doit monter les preuves Black Box sans conserver de credentials',
);
requireCondition(
  validatePr.includes('npm run check') && validatePr.includes('npm run build:ci'),
  'la validation PR doit exécuter les contrôles Astro et le build complet',
);
requireCondition(
  sourceJob.includes('npm run test:inline-svg:source') && sourceJob.includes('contents: read')
    && !sourceJob.includes('needs:') && !buildJob.includes('needs:'),
  'les suites SVG source et le build doivent rester indépendants et en parallèle',
);
requireCondition(
  publicationJob.includes('needs: [build, svg-source]')
    && !publicationJob.includes('always()') && !publicationJob.includes('continue-on-error')
    && publicationJob.includes('node scripts/stage-ci-release.mjs restore')
    && publicationJob.includes('artifact-ids: ${{ needs.build.outputs.artifact-id }}')
    && publicationJob.includes('L0G_CI_BUILD_ATTEMPT: ${{ needs.build.outputs.build-attempt }}'),
  'la publication doit attendre tous les tests et revérifier le transfert de release',
);
const prGate = job('validate-pr');
requireCondition(
  prGate.includes('needs: [validate-pr-build, svg-source]')
    && prGate.includes('always()') && prGate.includes('needs.validate-pr-build.result')
    && prGate.includes('needs.svg-source.result')
    && prGate.includes('test "$BUILD_RESULT" = success && test "$SVG_RESULT" = success'),
  'le check PR historique doit échouer si une des deux suites parallèles échoue',
);
requireCondition(
  !/contents: write|id-token: write|attestations: write/.test(buildJob + sourceJob + validatePr)
    && publicationJob.includes('contents: write') && publicationJob.includes('id-token: write'),
  'seul le job final peut obtenir les droits de publication et attestation',
);
requireCondition(
  buildJob.includes("L0G_APPEND_BLACK_BOX_FRAME: '1'")
    && buildJob.includes('BLACK_BOX_COMPUTED_AT: ${{ env.L0G_BUILD_TIMESTAMP }}')
    && !build.includes('npx astro build') && !build.includes('black-box-archive.mjs append')
    && rootPackage.scripts?.['build:ci']?.split('astro build').length === 2,
  'le build doit préparer sa frame une seule fois avant le rendu Astro unique',
);
requireCondition(
  rootPackage.scripts?.build === 'npm run build:prepare && astro build && npm run test:inline-svg && npm run build:verify'
    && rootPackage.scripts?.['build:ci'] === 'npm run prebuild && npm run build:prepare && astro build && npm run test:inline-svg:rendered && npm run build:verify'
    && rootPackage.scripts?.['test:inline-svg'] === 'node scripts/run-svg-tests.mjs'
    && rootPackage.scripts?.['test:inline-svg:source'] === 'node scripts/run-svg-tests.mjs --group source'
    && rootPackage.scripts?.['test:inline-svg:rendered'] === 'node scripts/run-svg-tests.mjs --group rendered',
  'les pipelines locaux et CI doivent conserver les mêmes contrôles complets',
);
requireCondition(
  !/path: public\/?(?:\s|$)/m.test(build)
    && buildJob.includes("if: github.ref == 'refs/heads/main' && steps.og_cache.outputs.cache-hit != 'true'")
    && !validatePr.includes('actions/cache/save@'),
  'le cache graphique doit exclure les snapshots publics et les écritures PR',
);

const productionInstalls = build
  .split('\n')
  .filter((line) => line.includes('npm ci') && line.includes('--omit=dev'));
requireCondition(
  productionInstalls.length === 2,
  `une installation MCP production est attendue par validation PR et publication, trouvé ${productionInstalls.length}`,
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
requireCondition(risk.includes("cron: '17 * * * *'"), 'le contrôle risque doit rester horaire à la minute 17');
requireCondition(risk.includes("if: github.repository == 'bluetouff/l0g'"), 'le cron risque doit être borné au dépôt canonique');
requireCondition(risk.includes('permissions:\n  contents: read'), 'le contrôle risque doit rester strictement en lecture seule');
requireCondition(risk.includes('timeout-minutes: 5'), 'le contrôle risque doit conserver sa limite de 5 minutes');
requireCondition(
  risk.includes('cancel-in-progress: true'),
  'les contrôles risque obsolètes doivent être annulés',
);
requireCondition(
  /Probe deployed producers[\s\S]*?if: github\.event_name == 'workflow_dispatch' \|\| github\.event_name == 'schedule'[\s\S]*?node scripts\/check-risk-producers\.mjs/.test(risk),
  'le push doit valider le contrat sans sonder une production pas encore activée',
);

const mcpRelease = workflows.get('publish-mcp.yml') || '';
requireCondition(
  mcpRelease.includes('npm run test:dependencies'),
  'la release MCP doit réauditer ses dépendances avant publication',
);

process.stdout.write(
  `CI policy OK: ${workflowNames.length} workflows, crons Hebdo et risque bornés, contrôles sécurité et métier ciblés.\n`,
);
