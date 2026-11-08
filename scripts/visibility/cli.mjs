#!/usr/bin/env node
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { audit, revision } from './audit.mjs';
import { ROOT, VERSION, PRIVATE_BYTES, privateDirectory, locked, readBounded, readPrivate, writePrivate, parseJson, digest } from './storage.mjs';
import { csvDocument, normalizeSearchImport, mergeImports } from './imports.mjs';
import { validatePanel, validateCoverage, normalizeObservations } from './panel.mjs';
import { privateTraffic } from './traffic.mjs';
import { buildReport } from './report.mjs';
import { probeLive } from './network.mjs';
import { notifyIndexNow } from './indexnow.mjs';
import { schedule } from './schedule.mjs';

function options(args) {
  const result = {};
  const flags = new Set(['dry-run', 'send', 'replace', 'strict', 'demo']);
  const names = new Set(['data-dir', 'dist', 'max-urls', 'rps', 'source', 'file', 'metadata', 'deployment', 'previous']);
  for (let i = 0; i < args.length; i++) {
    const key = args[i].replace(/^--/, '');
    if (!args[i].startsWith('--') || key in result) throw new Error('argument_invalid');
    if (flags.has(key)) result[key] = true;
    else if (names.has(key) && args[i + 1] && !args[i + 1].startsWith('--')) result[key] = args[++i];
    else throw new Error('argument_unknown');
  }
  return result;
}
async function input(path) { if (!path) throw new Error('file_required'); return parseJson(await readBounded(resolve(path))); }
async function boundedWrite(directory, name, value) {
  if (Buffer.byteLength(JSON.stringify(value, null, 2)) > PRIVATE_BYTES) throw new Error('private_state_capacity_exceeded');
  return writePrivate(directory, name, value);
}
async function loadState(directory) {
  return await readPrivate(directory, 'state.json', { schema_version: VERSION, imports: [], batches: [], actions: [] });
}
async function report(directory, state) {
  const traffic = await readPrivate(directory, 'traffic.json');
  if (traffic) {
    const cutoff = new Date(); cutoff.setUTCDate(cutoff.getUTCDate() - 90);
    traffic.cells = traffic.cells.filter(cell => cell.date >= cutoff.toISOString().slice(0, 10));
    if (!traffic.cells.length) traffic.state = 'no_data';
    await writePrivate(directory, 'traffic.json', traffic);
  }
  const result = buildReport({ audit: await readPrivate(directory, 'audit.json'), live: await readPrivate(directory, 'live.json'), deployment: await readPrivate(directory, 'deployment-verification.json'), consoles: await readPrivate(directory, 'console-connections.json'), traffic, panel: await readPrivate(directory, 'panel.json'), coverage: await readPrivate(directory, 'panel-coverage.json'), imports: state.imports, batches: state.batches, actions: state.actions, demo: state.data_mode === 'demo' });
  await writePrivate(directory, 'report.html', result.html);
  await boundedWrite(directory, 'report.json', result.summary);
  await writePrivate(directory, 'search.csv', result.searchCsv);
  await writePrivate(directory, 'panel.csv', result.panelCsv);
  return result.summary;
}

export async function main(args = process.argv.slice(2)) {
  const command = args.shift();
  const opts = options(args);
  const directory = await privateDirectory(opts['data-dir']);
  return locked(directory, async () => {
    const config = await readPrivate(directory, 'config.json', {});
    await privateDirectory(directory, config.served_roots ?? []);
    const state = await loadState(directory);
    const started = performance.now();
    let result;
    if (command === 'audit') {
      result = await audit(opts.dist ?? 'dist');
      await boundedWrite(directory, 'audit.json', result);
      await boundedWrite(directory, 'route-inventory.json', result.routes);
      if (opts.strict && result.summary.errors) process.exitCode = 2;
    } else if (command === 'live') {
      const snapshot = await readPrivate(directory, 'audit.json');
      if (!snapshot) throw new Error('audit_required');
      result = await probeLive(snapshot.routes, { maxUrls: Number(opts['max-urls'] ?? 20), rps: Number(opts.rps ?? 1) });
      const robots = result.requests.find(r => r.kind === 'robots');
      result.robots_match_local = robots?.sha256 ? robots.sha256 === snapshot.robots_sha256 : null;
      if (result.robots_match_local === false) result.state = 'partial';
      await writePrivate(directory, 'live.json', result);
      if (result.state !== 'measured') process.exitCode = 3;
    } else if (command === 'import') {
      const mode = opts.demo ? 'demo' : 'real';
      if (state.data_mode && state.data_mode !== mode) throw new Error('demo_real_data_mixing_forbidden');
      state.data_mode = mode;
      const source = opts.source;
      const text = await readBounded(resolve(opts.file ?? (() => { throw new Error('file_required'); })()));
      let incoming;
      if (source === 'panel-definition') {
        incoming = validatePanel(parseJson(text));
        const old = await readPrivate(directory, 'panel.json');
        if (old && old.panel_version === incoming.panel_version && old.content_hash !== incoming.content_hash) throw new Error('panel_version_immutable');
        if (old && old.panel_version !== incoming.panel_version) await writePrivate(directory, `panel-${old.content_hash}.json`, old);
        await boundedWrite(directory, 'panel.json', incoming);
        result = { state: 'measured', panel_version: incoming.panel_version, questions: incoming.questions.length, coverage: 'not_verified_until_private_review', paid_execution: 'disabled' };
      } else if (source === 'panel-coverage') {
        incoming = validateCoverage(parseJson(text), await readPrivate(directory, 'panel.json'));
        await boundedWrite(directory, 'panel-coverage.json', incoming);
        result = { state: incoming.state };
      } else if (source === 'traffic') {
        incoming = privateTraffic(text.split(/\r?\n/).filter(Boolean));
        incoming.evidence = { source: 'apache_combined_manual_import', input_sha256: digest(text), imported_at: new Date().toISOString(), formula: 'Disjoint date/class/referrer counts; k=5 and complementary suppression within date/class groups.', exclusions: 'Existing human-traffic parser; no raw IP, query, full referrer or log line retained.', coverage: 'Only the supplied log file. period is the retention window, not a claim of complete daily coverage.' };
        await boundedWrite(directory, 'traffic.json', incoming);
        result = { state: incoming.state, cells: incoming.cells.length };
        if (incoming.state === 'error') process.exitCode = 1;
        else if (incoming.state === 'partial') process.exitCode = 3;
      } else {
        if (source === 'panel') incoming = normalizeObservations(parseJson(text), await readPrivate(directory, 'panel.json'), config.allowed_subdomains ?? []);
        else incoming = /\.csv$/i.test(opts.file) ? csvDocument(source, text, await input(opts.metadata)) : normalizeSearchImport(source, parseJson(text));
        const contentHash = digest(incoming);
        const stored = `import-${contentHash}.json`;
        const proof = { file: stored, sha256: digest(`${JSON.stringify(incoming, null, 2)}\n`), key: source === 'panel' ? '/observations' : '/rows', imported_at: new Date().toISOString(), input_sha256: digest(text) };
        await boundedWrite(directory, stored, incoming);
        incoming = { ...incoming, content_hash: contentHash, evidence: proof };
        if (source === 'panel') {
          const previous = state.batches.find(b => b.run.id === incoming.run.id);
          if (previous && previous.content_hash !== incoming.content_hash) throw new Error('run_id_immutable');
          if (!previous) state.batches.push(incoming);
        } else state.imports = mergeImports(state.imports, incoming, opts.replace);
        result = { state: 'measured', source, evidence: stored, mode: 'normalized-v1; no native console connector claimed' };
      }
    } else if (command === 'report' || command === 'weekly') {
      result = await report(directory, state);
    } else if (command === 'daily') {
      if (config.daily_enabled !== true) result = { state: 'not_configured', reason: 'daily_enabled is false; no collection executed' };
      else {
        const snapshot = await readPrivate(directory, 'audit.json');
        if (!snapshot) throw new Error('audit_required');
        result = await probeLive(snapshot.routes, { maxUrls: 10, rps: 1 });
        await writePrivate(directory, 'live.json', result);
        if (result.state !== 'measured') process.exitCode = 3;
      }
    } else if (command === 'schedule') {
      result = await schedule(directory);
    } else if (command === 'indexnow') {
      if (opts.send && state.data_mode === 'demo') throw new Error('demo_network_notification_forbidden');
      if (opts.send && opts['dry-run']) throw new Error('indexnow_mode_conflict');
      result = await notifyIndexNow({ current: opts.deployment ? await input(opts.deployment) : null, previous: opts.previous ? await input(opts.previous) : null, config: config.indexnow, audit: await readPrivate(directory, 'audit.json'), live: await readPrivate(directory, 'live.json'), sent: await readPrivate(directory, 'indexnow-sent.json', []), send: opts.send === true });
      await writePrivate(directory, 'indexnow.json', result);
      if (result.accepted_ids?.length) await writePrivate(directory, 'indexnow-sent.json', [...new Set([...await readPrivate(directory, 'indexnow-sent.json', []), ...result.accepted_ids])]);
      if (result.state === 'error' || result.state === 'partial') process.exitCode = 3;
    } else throw new Error('command_unknown');
    state.actions.push({ at: new Date().toISOString(), command, source_sha: revision(), dirty_source: execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: ROOT, encoding: 'utf8' }).trim().length > 0, affected_pages: command === 'audit' ? 'audit.json#/routes' : [], expected_test: command, status: result.state ?? (result.summary?.errors ? 'error' : 'measured'), result: command === 'audit' ? result.summary : { state: result.state ?? 'measured' }, duration_ms: Math.round(performance.now() - started), rollback: 'Code: targeted revert; private data: retain versioned imports and schema 1.0.0.' });
    state.actions = state.actions.slice(-1000);
    await boundedWrite(directory, 'state.json', state);
    if (command === 'report' || command === 'weekly') await report(directory, state);
    process.stdout.write(JSON.stringify({ command, state: result.state ?? (result.summary?.errors ? 'error' : 'measured'), data_directory: directory, ...(result.summary ? { summary: result.summary } : {}) }) + '\n');
    return result;
  });
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  try { await main(); }
  catch (error) {
    // Never print an imported value, URL, response body, secret or stack trace.
    const code = /^[a-z][a-z0-9_]+$/.test(error.message) ? error.message : 'visibility_operation_failed';
    process.stderr.write(JSON.stringify({ state: 'error', code }) + '\n');
    process.exitCode = code === 'visibility_locked' ? 4 : 1;
  }
}
