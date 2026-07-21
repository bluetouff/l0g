const SIGNALS = ['us', 'eu', 'yen', 'energie', 'debt'];

function iso(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!/(?:Z|[+-]\d{2}:\d{2})$/i.test(raw)) return null;
  if (Number.isNaN(Date.parse(raw))) return null;
  return new Date(raw).toISOString();
}

function ageHours(value, now) {
  const parsed = iso(value);
  return parsed ? (Date.parse(now) - Date.parse(parsed)) / 3_600_000 : null;
}

export function auditRiskFlow(input, now = new Date().toISOString()) {
  const errors = [];
  const warnings = [];
  const aggregate = input.aggregate || {};
  const byKey = new Map((aggregate.indices || []).map((item) => [item.key, item]));

  if (String(aggregate.version) !== '2') errors.push('agrégateur: contrat v2 absent');
  if (!['ok', 'degraded'].includes(aggregate.status)) errors.push(`agrégateur: status=${aggregate.status || 'absent'}`);
  if (aggregate.software?.revisionStatus !== 'reported' || !aggregate.software?.revision) {
    errors.push('agrégateur: révision Git déployée non déclarée');
  }
  if (!/^[a-f0-9]{64}$/.test(aggregate.software?.sourceSha256 || '')) {
    errors.push('agrégateur: SHA-256 du code déployé absent');
  }
  for (const key of SIGNALS) {
    const item = byKey.get(key);
    if (!item) {
      errors.push(`${key}: absent de l’agrégat`);
      continue;
    }
    if (!iso(item.lastAttemptAt)) errors.push(`${key}: lastAttemptAt absent/invalide`);
    if (!iso(item.lastSuccessAt)) errors.push(`${key}: lastSuccessAt absent/invalide`);
    if (!iso(item.sourceUpdatedAt)) errors.push(`${key}: sourceUpdatedAt absent/invalide`);
    if (!['fresh', 'stale', 'unknown'].includes(item.timelinessStatus)) errors.push(`${key}: timelinessStatus invalide`);
    if (item.producerRevisionStatus !== 'reported' || !item.producerRevision) errors.push(`${key}: révision producteur déployée non déclarée`);
    if (item.sourceStatus === 'fallback') errors.push(`${key}: repli agrégateur actif (${item.fallbackReason || 'cause absente'})`);
    if (item.timelinessStatus === 'stale') errors.push(`${key}: producteur ancien (${item.sourceUpdatedAt || 'date absente'})`);
    if (item.qualityStatus === 'official-delayed') warnings.push(`${key}: source officielle différée acceptée`);
    if (item.qualityStatus === 'degraded') {
      const detail = item.warnings?.[0] || item.fallbackReason || 'cause détaillée dans le snapshot producteur';
      warnings.push(`${key}: qualité producteur dégradée (${detail})`);
    }
    if (item.fallbackUsed && item.fallbackLayer === 'producer') warnings.push(`${key}: repli interne producteur visible`);
  }

  const producerDates = {
    eu: input.eu?.generated_at,
    yen: input.yen?.generated,
    energie: input.energy?.generated,
    debt: input.debt?.generated_at,
  };
  const normalizedProducerDates = Object.fromEntries(
    Object.entries(producerDates).map(([key, value]) => [key, iso(value)]),
  );
  const producerPublishedAfterAttempt = new Set();
  for (const [key, value] of Object.entries(normalizedProducerDates)) {
    if (!value) {
      const raw = producerDates[key];
      errors.push(raw
        ? `${key}: date producteur sans fuseau explicite ou invalide (${raw})`
        : `${key}: date producteur publique absente`);
    }
    const item = byKey.get(key);
    const aggregateDate = iso(item?.sourceUpdatedAt);
    if (value && Date.parse(value) - Date.parse(now) > 5 * 60_000) {
      errors.push(`${key}: date producteur située à plus de cinq minutes dans le futur (${value})`);
    } else if (value && aggregateDate && value !== aggregateDate) {
      const attemptDate = iso(item?.lastAttemptAt);
      if (attemptDate && Date.parse(value) > Date.parse(attemptDate)) {
        producerPublishedAfterAttempt.add(key);
        warnings.push(`${key}: nouveau snapshot publié après la tentative d’agrégation ; rattrapage attendu (${attemptDate} -> ${value})`);
      } else {
        errors.push(`${key}: date agrégée différente du producteur (${aggregateDate} != ${value})`);
      }
    }
  }

  const expectedValues = {
    eu: typeof input.eu?.global_score === 'number' ? Math.round(input.eu.global_score) : null,
    energie: typeof input.energy?.composite?.score === 'number' ? Math.round(input.energy.composite.score) : null,
    debt: typeof input.debt?.score?.current_stress === 'number' ? Math.round(input.debt.score.current_stress) : null,
  };
  for (const [key, expected] of Object.entries(expectedValues)) {
    if (expected == null) errors.push(`${key}: score producteur absent`);
    else if (byKey.get(key)?.value !== expected && !producerPublishedAfterAttempt.has(key)) {
      errors.push(`${key}: valeur agrégée ${byKey.get(key)?.value} != producteur ${expected}`);
    }
  }

  const oilRows = [input.energy?.series?.brent, input.energy?.series?.wti].filter(Boolean);
  if (oilRows.length !== 2) errors.push('energie: Brent/WTI absents');
  for (const row of oilRows) {
    if (!row.tip_source) errors.push(`energie: tip_source absent pour ${row.label || 'pétrole'}`);
    if (!row.date) errors.push(`energie: date absente pour ${row.label || 'pétrole'}`);
    const age = row.date ? ageHours(`${row.date}T23:59:59Z`, now) : null;
    if (age != null && age > 10 * 24) errors.push(`energie: point pétrole âgé de plus de 10 jours (${row.date})`);
  }

  const operational = input.canonicalHistory?.coverage?.operationalImport;
  if (!operational || operational.status !== 'ok') errors.push(`historique fusionné: import opérationnel ${operational?.status || 'absent'}`);
  if (!SIGNALS.every((key) => input.canonicalHistory?.coverage?.instruments?.includes(key))) {
    errors.push('historique fusionné: couverture incomplète des cinq signaux');
  }
  if (!input.rawLast?.snapshot || ageHours(input.rawLast.snapshot, now) > 1) {
    errors.push(`journal brut: dernier snapshot trop ancien ou absent (${input.rawLast?.snapshot || 'absent'})`);
  }
  if (!Object.prototype.hasOwnProperty.call(input.rawLast || {}, 'debt')) {
    errors.push('journal brut: colonne debt absente du dernier snapshot');
  }

  return {
    checkedAt: now,
    ok: errors.length === 0,
    errors,
    warnings,
    summary: {
      signals: SIGNALS.length,
      aggregateStatus: aggregate.status || null,
      aggregateGenerated: aggregate.generated || aggregate.updated || null,
      rawHistoryLast: input.rawLast?.snapshot || null,
      canonicalObservations: input.canonicalHistory?.coverage?.observations || 0,
    },
  };
}

function markdown(value) {
  return String(value ?? 'n/d').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function renderRiskAuditMarkdown(report) {
  const summary = report.summary || {};
  const rows = [
    ['Résultat', report.ok ? 'OK' : 'ÉCHEC'],
    ['Contrôlé à', report.checkedAt || 'n/d'],
    ['Statut agrégé', summary.aggregateStatus || 'n/d'],
    ['Génération agrégée', summary.aggregateGenerated || 'n/d'],
    ['Dernière ligne brute', summary.rawHistoryLast || 'n/d'],
    ['Observations fusionnées', summary.canonicalObservations ?? 0],
  ];
  const lines = [
    '## Contrôle des producteurs de risque',
    '',
    '| Champ | Valeur |',
    '| --- | --- |',
    ...rows.map(([label, value]) => `| ${markdown(label)} | ${markdown(value)} |`),
  ];
  if (report.errors?.length) {
    lines.push('', '### Erreurs', '', ...report.errors.map((error) => `- ${markdown(error)}`));
  }
  if (report.warnings?.length) {
    lines.push('', '### Avertissements', '', ...report.warnings.map((warning) => `- ${markdown(warning)}`));
  }
  lines.push('');
  return lines.join('\n');
}

export function githubAnnotation(level, message) {
  const escaped = String(message)
    .replaceAll('%', '%25')
    .replaceAll('\r', '%0D')
    .replaceAll('\n', '%0A');
  return `::${level}::${escaped}`;
}
