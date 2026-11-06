/* Actualise le bandeau de signaux prérempli au build depuis /risk.json.
   Servi comme actif versionné depuis l'origine du site -> compatible CSP stricte.
   Aucun appel tiers : le navigateur ne lit qu'un fichier local de l0g.fr. */
(function () {
  var TONE = {
    calm: 'var(--color-signal)',       // teal — détendu
    moderate: 'var(--color-amber)',    // ambre — modéré
    elevated: 'var(--color-elevated)', // orange — tendu
    stress: 'var(--color-accent)',     // rose — stress
    crisis: 'var(--color-accent)',     // rose — crise
  };

  function clampPct(value, scale) {
    var s = scale || 100;
    var p = (Number(value) / s) * 100;
    if (isNaN(p)) return 0;
    return Math.max(0, Math.min(100, p));
  }

  function formatDate(value, withTime) {
    if (typeof value !== 'string' || !value) return null;
    try {
      var date = new Date(value);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/Paris',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
      });
    } catch (e) {
      return null;
    }
  }

  function statusText(item) {
    var sourceDate = formatDate(item.sourceUpdatedAt || item.sourcePublishedAt, true);
    var brentDate = item.componentDates && item.componentDates.brent;
    var wtiDate = item.componentDates && item.componentDates.wti;
    var componentDate = brentDate === wtiDate ? formatDate(brentDate, false) : null;
    if (item.sourceStatus === 'fallback' || item.fallbackLayer === 'aggregator') {
      return 'repli best effort · dernier succès ' + (formatDate(item.lastSuccessAt, true) || 'inconnu');
    }
    if (debtExpired(item)) {
      return `publication expirée · calcul ${sourceDate || 'non daté'}`;
    }
    if (item.cacheUsed === true) {
      return `cache source validé · calcul ${sourceDate || 'non daté'}`;
    }
    if (item.qualityStatus === 'official-delayed') {
      if (item.key === 'debt') return 'publication trimestrielle différée · source ' + (sourceDate || 'non datée');
      return 'officiel différé (EIA) · pétrole au ' + (componentDate || 'jour publié');
    }
    if (item.timelinessStatus === 'stale') {
      return 'source ancienne · donnée ' + (sourceDate || 'non datée');
    }
    if (item.qualityStatus === 'degraded') {
      return 'couverture dégradée · donnée ' + (sourceDate || 'non datée');
    }
    if (item.qualityStatus === 'unknown') {
      return 'provenance partielle · date source inconnue';
    }
    return 'source ' + (sourceDate || 'non datée');
  }

  function isDegraded(item) {
    return Boolean(item && (
      item.sourceStatus === 'fallback'
      || item.fallbackLayer === 'aggregator'
      || item.timelinessStatus === 'stale'
      || item.qualityStatus === 'degraded'
      || item.qualityStatus === 'unknown'
      || (item.fallbackUsed && item.qualityStatus !== 'official-delayed')
    ));
  }

  function isUnavailable(item) {
    var scale = item && item.scale != null ? item.scale : 100;
    return Boolean(!item || (
      !Number.isFinite(item.value) || !Number.isFinite(scale) || scale <= 0
      || item.value < 0 || item.value > scale || debtExpired(item)
      || item.sourceStatus === 'fallback'
      || item.fallbackLayer === 'aggregator'
      || item.timelinessStatus === 'stale'
    ));
  }

  function debtExpired(item) {
    return item.key === 'debt' && item.methodologyVersion === '2.0'
      && !(Date.parse(item.validUntil || '') > Date.now());
  }

  var lastRendered = null;
  var keys = ['us', 'eu', 'yen', 'energie', 'debt'];

  function renderSignal(it) {
    if (!it || keys.indexOf(it.key) === -1) return;
    var tile = document.querySelector('[data-risk="' + it.key + '"]');
    if (!tile) return;
    var color = Object.prototype.hasOwnProperty.call(TONE, it.tone) ? TONE[it.tone] : 'var(--color-muted)';
    var valEl = tile.querySelector('[data-value]');
    var lvlEl = tile.querySelector('[data-level]');
    var fillEl = tile.querySelector('[data-fill]');
    var statusEl = tile.querySelector('[data-status]');
    var degraded = isDegraded(it);
    var unavailable = isUnavailable(it);
    tile.dataset.degraded = degraded ? 'true' : 'false';
    tile.dataset.unavailable = unavailable ? 'true' : 'false';
    if (it.key === 'debt') {
      if (typeof it.methodologyVersion === 'string') tile.dataset.methodologyVersion = it.methodologyVersion;
      if (Object.prototype.hasOwnProperty.call(it, 'validUntil')) tile.dataset.validUntil = typeof it.validUntil === 'string' ? it.validUntil : '';
    }
    if (valEl) {
      valEl.textContent = !unavailable && it.value != null ? it.value : '—';
      valEl.style.color = unavailable ? 'var(--color-muted)' : color;
    }
    if (lvlEl) {
      lvlEl.textContent = unavailable ? 'INDISPONIBLE' : it.level || '';
      lvlEl.style.color = unavailable ? 'var(--color-muted)' : color;
    }
    if (fillEl) {
      fillEl.style.width = (unavailable ? 0 : clampPct(it.value, it.scale)) + '%';
      fillEl.style.background = unavailable ? 'var(--color-muted)' : color;
    }
    if (statusEl) statusEl.textContent = statusText(it);
    var scale = Number.isFinite(it.scale) && it.scale > 0 ? it.scale : 100;
    [['[data-scale]', '/' + scale], ['[data-axis-mid]', scale / 2], ['[data-axis-max]', scale]].forEach(function (field) {
      var node = tile.querySelector(field[0]);
      if (node) node.textContent = String(field[1]);
    });
    var meter = tile.querySelector('[data-meter]');
    if (meter) {
      meter.setAttribute('role', unavailable ? 'img' : 'meter');
      meter.setAttribute('aria-label', unavailable ? 'Signal indisponible' : 'Score normalisé du modèle');
      for (var name of ['aria-valuenow', 'aria-valuemin', 'aria-valuemax']) meter.removeAttribute(name);
      if (!unavailable) {
        meter.setAttribute('aria-valuenow', String(it.value));
        meter.setAttribute('aria-valuemin', '0');
        meter.setAttribute('aria-valuemax', String(it.scale == null ? 100 : it.scale));
      }
    }
    [['[data-source-date]', it.sourcePublishedAt || it.sourceUpdatedAt, true], ['[data-observed-date]', it.observedAt, it.observationTimePrecision === 'date-time']].forEach(function (field) {
      var node = tile.querySelector(field[0]);
      if (!node) return;
      var text = formatDate(field[1], field[2]);
      node.textContent = text || 'Non datée';
      if (text) node.setAttribute('datetime', field[1]); else node.removeAttribute('datetime');
    });
    if (typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('[data-risk-mini="' + it.key + '"]').forEach(function (mini) {
        var value = mini.querySelector('[data-mini-value]');
        if (value) value.textContent = unavailable ? '—' : it.value;
        if (mini.tagName === 'A') mini.setAttribute('aria-label', mini.dataset.label + ' : ' + (unavailable ? 'indisponible' : it.value));
      });
    }
  }

  function render(data) {
    if (!data || !Array.isArray(data.indices)) return;
    lastRendered = data;
    data.indices.forEach(renderSignal);
    var upd = document.getElementById('risk-updated');
    if (upd) {
      try {
        var d = formatDate(data.aggregateGeneratedAt || data.updated || data.generated, true);
        var count = data.indices.filter(function (item) {
          return isDegraded(item);
        }).length;
        var officialDelayedCount = data.indices.filter(function (item) {
          return item && item.qualityStatus === 'official-delayed' && !isDegraded(item);
        }).length;
        var statusDetail = '';
        if (data.status === 'degraded') {
          statusDetail = count
            ? ' · état dégradé visible (' + count + ')'
            : officialDelayedCount
              ? ' · source officielle différée (' + officialDelayedCount + ')'
              : ' · état dégradé déclaré';
        }
        upd.textContent = d
          ? ' Assemblage ' + d + statusDetail + '.'
          : '';
      } catch (e) {}
    }
    if (typeof document.querySelectorAll === 'function') document.querySelectorAll('[data-risk-summary-date]').forEach(function (node) {
      node.textContent = 'assemblage ' + (formatDate(data.aggregateGeneratedAt || data.updated || data.generated, true) || 'non daté');
    });
  }

  // A page can outlive its build snapshot. Hide expired SSR debt before polling.
  function expireDebtFromMarkup() {
    var initialDebt = document.querySelector('[data-risk="debt"]');
    if (!initialDebt || !debtExpired({ key: 'debt', methodologyVersion: initialDebt.dataset.methodologyVersion, validUntil: initialDebt.dataset.validUntil })) return;
    var sourceTime = initialDebt.querySelector('[data-source-date]');
    var observedTime = initialDebt.querySelector('[data-observed-date]');
    renderSignal({ key: 'debt', value: null, methodologyVersion: '2.0', validUntil: initialDebt.dataset.validUntil,
      sourcePublishedAt: sourceTime && sourceTime.getAttribute('datetime'), observedAt: observedTime && observedTime.getAttribute('datetime') });
  }
  expireDebtFromMarkup();
  document.addEventListener('click', function (event) {
    var link = event.target instanceof Element ? event.target.closest('[data-risk-select]') : null;
    if (!link || keys.indexOf(link.dataset.riskSelect) === -1) return;
    var choice = document.getElementById('risk-choice-' + link.dataset.riskSelect);
    if (!choice) return;
    event.preventDefault(); choice.checked = true; choice.focus();
  });

  function hasSignal(data, key) {
    if (!data || !Array.isArray(data.indices)) return false;
    return data.indices.some(function (it) {
      return it && it.key === key && it.value != null;
    });
  }

  function mergeSignal(data, signal, updated) {
    var base = data && typeof data === 'object' ? data : {};
    var indices = Array.isArray(base.indices) ? base.indices.slice() : [];
    var found = false;
    indices = indices.map(function (it) {
      if (it && it.key === signal.key) {
        found = true;
        return Object.assign({}, it, signal);
      }
      return it;
    });
    if (!found) indices.push(signal);
    return Object.assign({}, base, {
      updated: base.updated || updated,
      indices: indices,
    });
  }

  function snapshotUpdated(snapshot) {
    if (!snapshot) return null;
    return snapshot.generated || (snapshot.provenance && snapshot.provenance.generatedAt) || null;
  }

  function loadDebtSnapshot(data) {
    return fetch('/debt-latest.json', { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (snapshot) {
        var signal = snapshot && snapshot.signal;
        if (!signal || signal.key !== 'debt' || signal.value == null) return data;
        return mergeSignal(data, signal, snapshotUpdated(snapshot));
      });
  }

  function refresh() {
    fetch('/risk.json', { cache: 'no-store' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        return hasSignal(data, 'debt') ? data : loadDebtSnapshot(data);
      })
      .then(render)
      .catch(function () {
        loadDebtSnapshot(null).then(render).catch(function () {});
      });
  }

  function scheduleRefresh() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(refresh, { timeout: 3000 });
    } else {
      window.setTimeout(refresh, 1200);
    }
  }

  if (document.readyState === 'complete') scheduleRefresh();
  else window.addEventListener('load', scheduleRefresh, { once: true });
  // Read only public static snapshots. Never call providers from the browser.
  window.setInterval(function () {
    if (!document.hidden) refresh();
  }, 15 * 60 * 1000);
  window.setInterval(function () {
    if (!document.hidden) {
      if (lastRendered) render(lastRendered);
      expireDebtFromMarkup();
    }
  }, 60 * 1000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      if (lastRendered) render(lastRendered);
      expireDebtFromMarkup();
      refresh();
    }
  });
})();
