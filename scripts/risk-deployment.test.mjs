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
});

test('la configuration versionnée sert les fichiers vivants et neutralise les anciens scripts', async () => {
  const [apache, service, installer, activator, agentSurface] = await Promise.all([
    readFile(new URL('deploy/l0g.fr.apache.conf', root), 'utf8'),
    readFile(new URL('ops/risk-aggregator/l0g-risk.service', root), 'utf8'),
    readFile(new URL('ops/risk-aggregator/install-server.sh', root), 'utf8'),
    readFile(new URL('ops/risk-aggregator/activate-zen.sh', root), 'utf8'),
    readFile(new URL('src/lib/agent-surface.ts', root), 'utf8'),
  ]);
  for (const alias of [
    'Alias /risk.json /var/www/l0g-data/risk.json',
    'Alias /api/v1/risk.json /var/www/l0g-data/api-risk.json',
    'Alias /api/v1/risk.xml /var/www/l0g-data/risk-events.xml',
    'Alias /api/v1/history.ndjson /var/www/l0g-data/history.ndjson',
    'Alias /api/v1/history.csv /var/www/l0g-data/history.csv',
  ]) {
    assert.ok(apache.includes(alias), `Alias Apache absent: ${alias}`);
  }
  assert.ok(service.includes('ExecStart=/usr/bin/python3 /usr/local/lib/l0g-risk/l0g-risk.py'));
  assert.ok(!service.includes('/usr/local/bin/l0g-risk.py'));
  assert.ok(installer.includes("'ExecStartPost='"), 'le reset des anciens ExecStartPost doit être explicite');
  assert.ok(installer.indexOf('verify-producer-deployment.py') < installer.indexOf('systemctl restart l0g-risk.service'));
  assert.ok(activator.indexOf('check_stage debt') < activator.indexOf('systemctl restart debt-risk-radar-export.service'));
  assert.ok(activator.indexOf('check_stage energie') < activator.indexOf('systemctl restart energie-snapshot.service'));
  assert.ok(activator.includes('/var/www/html/energie/snapshot.json'));
  assert.ok(!activator.includes('/opt/energie/web/snapshot.json'));
  const debtSchema = agentSurface.slice(
    agentSurface.indexOf('DebtRiskTileSignal:'),
    agentSurface.indexOf('RiskSignalProvenanceBucket:'),
  );
  for (const field of ['rawValue:', 'producerRepository:', 'producerRevision:', 'producerRevisionStatus:']) {
    assert.ok(debtSchema.includes(field), `DebtRiskTileSignal doit publier ${field.slice(0, -1)}`);
  }
});
