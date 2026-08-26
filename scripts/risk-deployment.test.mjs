import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('le manifeste relie cinq producteurs à des révisions et fichiers vérifiables', async () => {
  const manifest = JSON.parse(await readFile(new URL('ops/risk-aggregator/producer-deployment.json', root), 'utf8'));
  assert.equal(manifest.schemaVersion, 1);
  assert.deepEqual(Object.keys(manifest.producers), ['us', 'eu', 'yen', 'energie', 'debt']);
  const paths = [];
  for (const [key, producer] of Object.entries(manifest.producers)) {
    assert.match(producer.repository, /^https:\/\/github\.com\/bluetouff\//, `${key}: dépôt public absent`);
    assert.match(producer.revision, /^[a-f0-9]{40}$/, `${key}: révision invalide`);
    assert.ok(producer.files.length > 0, `${key}: fichier déployé absent`);
    for (const file of producer.files) {
      assert.ok(file.path.startsWith('/opt/'), `${key}: chemin actif non absolu`);
      assert.match(file.sha256, /^[a-f0-9]{64}$/, `${key}: SHA-256 invalide`);
      paths.push(file.path);
    }
  }
  assert.equal(new Set(paths).size, paths.length, 'un fichier actif ne doit appartenir qu’à un producteur');
  assert.ok(paths.includes('/opt/euromacro/build_snapshot.py'), 'le générateur Euro doit être attesté');
  for (const path of [
    '/opt/euromacro/catalog.py',
    '/opt/euromacro/data.py',
    '/opt/euromacro/snapshot_contract.py',
    '/opt/euromacro/validate_snapshot.py',
    '/opt/euromacro/requirements-prod.txt',
    '/opt/euromacro/deploy/refresh.sh',
  ]) {
    assert.ok(paths.includes(path), `la dépendance Euro doit être attestée: ${path}`);
  }
});

test('la configuration versionnée sert les fichiers vivants et neutralise les anciens scripts', async () => {
  const [apache, service, installer, outputVerifier, humanTrafficInstaller, activator, euroActivator, agentSurface, riskClient, riskBand, riskProvenance, radar, nowPage, topicPage, home] = await Promise.all([
    readFile(new URL('deploy/l0g.fr.apache.conf', root), 'utf8'),
    readFile(new URL('ops/risk-aggregator/l0g-risk.service', root), 'utf8'),
    readFile(new URL('ops/risk-aggregator/install-server.sh', root), 'utf8'),
    readFile(new URL('ops/risk-aggregator/verify-risk-output.py', root), 'utf8'),
    readFile(new URL('deploy/install-human-traffic.sh', root), 'utf8'),
    readFile(new URL('ops/risk-aggregator/activate-zen.sh', root), 'utf8'),
    readFile(new URL('ops/risk-aggregator/activate-euromacro-zen.sh', root), 'utf8'),
    readFile(new URL('src/lib/agent-surface.ts', root), 'utf8'),
    readFile(new URL('src/scripts/risk.js', root), 'utf8'),
    readFile(new URL('src/components/RiskBand.astro', root), 'utf8'),
    readFile(new URL('src/components/RiskProvenance.astro', root), 'utf8'),
    readFile(new URL('src/pages/radar.astro', root), 'utf8'),
    readFile(new URL('src/pages/maintenant.astro', root), 'utf8'),
    readFile(new URL('src/pages/sujet/[slug].astro', root), 'utf8'),
    readFile(new URL('src/pages/[...page].astro', root), 'utf8'),
  ]);
  for (const alias of [
    'Alias /risk.json /var/www/l0g-data/risk.json',
    'Alias /confluence.json /var/www/l0g-data/confluence.json',
    'Alias /api/v1/risk.json /var/www/l0g-data/api-risk.json',
    'Alias /api/v1/risk.xml /var/www/l0g-data/risk-events.xml',
    'Alias /api/v1/history.ndjson /var/www/l0g-data/history.ndjson',
    'Alias /api/v1/history.csv /var/www/l0g-data/history.csv',
  ]) {
    assert.ok(apache.includes(alias), `Alias Apache absent: ${alias}`);
  }
  assert.ok(service.includes('ExecStart=/usr/bin/python3 /usr/local/lib/l0g-risk/l0g-risk.py'));
  assert.ok(
    service.includes('SupplementaryGroups=usdashboard'),
    'le service doit pouvoir lire le bundle macro privé sans élargir ses permissions globales',
  );
  assert.ok(!service.includes('/usr/local/bin/l0g-risk.py'));
  assert.ok(installer.includes("'ExecStartPost='"), 'le reset des anciens ExecStartPost doit être explicite');
  assert.ok(installer.includes('"${DROPIN_DIR}/override.conf"'), 'le drop-in historique doit être sauvegardé');
  assert.ok(installer.includes('rm -f -- "${DROPIN_DIR}/override.conf"'), 'le drop-in historique doit être retiré');
  assert.ok(installer.includes("grep -Fq '/usr/local/bin/'"), 'la configuration effective doit exclure les anciens scripts');
  assert.ok(
    installer.indexOf('rm -f -- "${DROPIN_DIR}/override.conf"') < installer.lastIndexOf('systemctl daemon-reload'),
    'le drop-in historique doit être retiré avant le rechargement systemd',
  );
  assert.ok(installer.indexOf('verify-producer-deployment.py') < installer.indexOf('systemctl restart l0g-risk.service'));
  assert.ok(installer.includes('--confluence /var/www/l0g-data/confluence.json'));
  assert.ok(outputVerifier.includes('observedAtMethod'));
  assert.ok(outputVerifier.includes('un repli republie encore des lignes anciennes'));
  assert.ok(
    humanTrafficInstaller.includes('install -d -o l0grisk -g l0grisk -m 0755 "$DATA_DIR"'),
    'le rapport de trafic doit préserver l’écriture de l’agrégateur dans le répertoire partagé',
  );
  assert.ok(
    !humanTrafficInstaller.includes('"${INSTALL_ROOT}/mcp-server" \\\n  "$DATA_DIR"'),
    'le rapport de trafic ne doit jamais reprendre le répertoire partagé à root:root',
  );
  assert.ok(activator.indexOf('check_stage debt') < activator.indexOf('systemctl restart debt-risk-radar-export.service'));
  assert.ok(activator.indexOf('check_stage energie') < activator.indexOf('systemctl restart energie-snapshot.service'));
  assert.ok(activator.includes('/var/www/html/energie/snapshot.json'));
  assert.ok(!activator.includes('/opt/energie/web/snapshot.json'));
  assert.ok(euroActivator.includes('RUNTIME_FILES=('), 'la release Euro doit être validée comme un lot');
  assert.ok(euroActivator.indexOf('sha256sum "$source"') < euroActivator.indexOf('systemctl restart euromacro-snapshot.service'));
  assert.ok(euroActivator.includes('d.get("source_sha") == sys.argv[1]'));
  assert.ok(euroActivator.includes('/opt/euromacro/L0G_ATTESTED_SHA'));
  assert.ok(euroActivator.indexOf('/opt/euromacro/L0G_ATTESTED_SHA') < euroActivator.indexOf('systemctl restart euromacro-snapshot.service'));
  assert.ok(euroActivator.includes('d.get("quality") or {}).get("status") == "ok"'));
  assert.ok(euroActivator.indexOf('systemctl stop euromacro-snapshot.timer') < euroActivator.indexOf('install -o euromacro'));
  assert.ok(euroActivator.indexOf('systemctl restart euromacro-snapshot.service') < euroActivator.indexOf('install-server.sh'));
  assert.ok(euroActivator.includes('/var/www/html/euromacro/snapshot.json'));
  const debtSchema = agentSurface.slice(
    agentSurface.indexOf('DebtRiskTileSignal:'),
    agentSurface.indexOf('RiskSignalProvenanceBucket:'),
  );
  for (const field of [
    'rawValue:',
    'observedAt:',
    'observationStatus:',
    'coverageStatus:',
    'backtestUsable:',
    'producerRepository:',
    'producerRevision:',
    'producerRevisionStatus:',
  ]) {
    assert.ok(debtSchema.includes(field), `DebtRiskTileSignal doit publier ${field.slice(0, -1)}`);
  }
  assert.ok(riskClient.includes("window.addEventListener('load', scheduleRefresh, { once: true })"));
  assert.ok(riskClient.includes('window.requestIdleCallback(refresh, { timeout: 3000 })'));
  assert.ok(riskClient.indexOf('function refresh()') < riskClient.indexOf("fetch('/risk.json'"));
  assert.match(riskBand, /href=\{it\.href\}[\s\S]*?class="risk-tile-main risk-dashboard-link"[\s\S]*?target="_blank"/);
  assert.match(riskBand, /class="risk-proof-link" href=\{`\/maintenant\/#signal-\$\{it\.key\}`\}/);
  assert.match(riskBand, /signal\.fallbackUsed && signal\.qualityStatus !== 'official-delayed'/);
  assert.match(riskClient, /item\.fallbackUsed && item\.qualityStatus !== 'official-delayed'/);
  assert.match(riskBand, /it\.unavailable \? 'INDISPONIBLE'/);
  assert.match(riskClient, /unavailable \? 'INDISPONIBLE'/);
  assert.match(riskProvenance, /unavailable \? 'signal indisponible'/);
  assert.match(radar, /unavailable \? 'INDISPONIBLE'/);
  assert.match(nowPage, /filter\(\(signal\) => !isRiskSignalUnavailable\(signal\)\)/);
  assert.match(nowPage, /unavailable \? 'INDISPONIBLE'/);
  assert.match(topicPage, /unavailable \? 'INDISPONIBLE'/);
  const performanceAudit = await readFile(new URL('scripts/audit-performance.mjs', root), 'utf8');
  assert.ok(performanceAudit.includes('hasNumericValue || failsClosed'));
  assert.ok(performanceAudit.includes('INDISPONIBLE explicite'));
  assert.ok(
    home.indexOf('<section class="home-featured"') < home.indexOf('<section class="home-risk"'),
    'l’analyse vedette doit précéder les signaux',
  );
});

test('le push valide le contrat sans sonder une production pas encore activée', async () => {
  const workflow = await readFile(new URL('.github/workflows/risk-producers.yml', root), 'utf8');
  const probeStep = workflow.slice(workflow.indexOf('- name: Probe deployed producers'));

  assert.ok(probeStep.startsWith('- name: Probe deployed producers'));
  assert.match(workflow, /schedule:[\s\S]*?cron: '17 \* \* \* \*'/);
  assert.match(probeStep, /if: github\.event_name == 'workflow_dispatch' \|\| github\.event_name == 'schedule'[\s\S]*?run: node scripts\/check-risk-producers\.mjs/);
});

test('la découverte MCP publique ne fabrique pas de serveur OAuth', async () => {
  const [apache, discovery, oauth404, docs] = await Promise.all([
    readFile(new URL('deploy/l0g.fr.apache.conf', root), 'utf8'),
    readFile(new URL('public/.well-known/mcp.json', root), 'utf8').then(JSON.parse),
    readFile(new URL('public/.well-known/mcp-oauth-not-supported.json', root), 'utf8').then(JSON.parse),
    readFile(new URL('src/pages/mcp.astro', root), 'utf8'),
  ]);
  assert.equal(discovery.authentication.required, false);
  assert.equal(discovery.authentication.oauthDiscovery, null);
  assert.equal(oauth404.status, 404);
  assert.ok(apache.includes('ErrorDocument 404 /.well-known/mcp-oauth-not-supported.json'));
  assert.ok(docs.includes('statut 404 documenté'));
});

test('la page Statut mesure fraîcheur, corpus et retards depuis les contrats servis', async () => {
  const [page, client, confluencePage, confluenceClient, updater, validator, staticRiskRoute] = await Promise.all([
    readFile(new URL('src/pages/status.astro', root), 'utf8'),
    readFile(new URL('public/status-live.js', root), 'utf8'),
    readFile(new URL('src/pages/confluence.astro', root), 'utf8'),
    readFile(new URL('public/confluence-table.js', root), 'utf8'),
    readFile(new URL('scripts/update-risk-snapshot.mjs', root), 'utf8'),
    readFile(new URL('scripts/validate-risk-snapshot.mjs', root), 'utf8'),
    readFile(new URL('src/pages/api/v1/risk.json.ts', root), 'utf8'),
  ]);
  assert.ok(!page.includes("getCollection('posts'"));
  for (const card of ['risk', 'eu', 'confluence', 'energy', 'corpus']) {
    assert.ok(page.includes(`data-live-card="${card}"`), `carte live absente: ${card}`);
  }
  for (const endpoint of ['/api/v1/risk.json', '/api/v1/freshness.json', '/confluence.json']) {
    assert.ok(client.includes(endpoint), `source live absente: ${endpoint}`);
  }
  assert.ok(client.includes('risk.staleAfter'));
  assert.ok(client.includes('alerte 5 j'));
  assert.ok(confluencePage.includes('pas nécessairement une nouvelle publication SEC EDGAR'));
  assert.ok(confluenceClient.includes('fraîcheur EDGAR non attestée'));
  assert.ok(confluenceClient.includes('Confluence indisponible'));
  assert.ok(confluenceClient.includes("String(data.version) === '2'"));
  assert.ok(client.includes('contrat v2 daté absent ou invalide'));
  assert.ok(updater.includes("atomicJsonWrite(CONFLUENCE_PATH"));
  assert.ok(updater.includes('items: []'));
  assert.ok(updater.includes("observationStatus: observationComplete ? 'known' : 'missing'"));
  assert.ok(updater.includes("'Agrégateur sans date économique observedAt; valeur indisponible"));
  assert.ok(validator.includes("item.sourceStatus === 'ok' && !observedAtValid"));
  assert.ok(validator.includes("item.backtestUsable !== false"));
  assert.ok(staticRiskRoute.includes('complete && observationComplete && snapshotFresh'));
  assert.ok(staticRiskRoute.includes('date économique observedAt absente, valeur retirée'));
  assert.ok(staticRiskRoute.includes('snapshot statique trop ancien, valeur retirée'));
  assert.ok(staticRiskRoute.includes('contractValid && !fallback ? conf.items : []'));
});

test('les icônes demandées par les navigateurs sont générées localement', async () => {
  const [favicon, apple, precomposed, ico, generator] = await Promise.all([
    readFile(new URL('public/favicon-32x32.png', root)),
    readFile(new URL('public/apple-touch-icon.png', root)),
    readFile(new URL('public/apple-touch-icon-precomposed.png', root)),
    readFile(new URL('public/favicon.ico', root)),
    readFile(new URL('scripts/generate-icons.mjs', root), 'utf8'),
  ]);
  const pngSignature = '89504e470d0a1a0a';
  assert.equal(favicon.subarray(0, 8).toString('hex'), pngSignature);
  assert.equal(apple.subarray(0, 8).toString('hex'), pngSignature);
  assert.equal(precomposed.subarray(0, 8).toString('hex'), pngSignature);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.ok(generator.includes("resize(180, 180)"));
});
