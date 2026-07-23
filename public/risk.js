/* Actualise le bandeau de signaux prérempli au build depuis /risk.json.
   Servi depuis l'origine du site (self) -> compatible CSP stricte.
   Aucun appel tiers : le navigateur ne lit qu'un fichier local de l0g.fr. */
(function () {
  var TONE = {
    calm: '#5eead4',     // teal — détendu
    moderate: '#f5b13d', // ambre — modéré
    elevated: '#ff8a3d', // orange — tendu
    stress: '#ff4d87',   // rose — stress
    crisis: '#ff4d87',   // rose — crise
  };

  function clampPct(value, scale) {
    var s = scale || 100;
    var p = (Number(value) / s) * 100;
    if (isNaN(p)) return 0;
    return Math.max(0, Math.min(100, p));
  }

  function formatDate(value, withTime) {
    if (!value) return null;
    try {
      var date = new Date(value);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
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
    if (item.qualityStatus === 'official-delayed') {
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

  function render(data) {
    if (!data || !Array.isArray(data.indices)) return;
    data.indices.forEach(function (it) {
      var tile = document.querySelector('[data-risk="' + it.key + '"]');
      if (!tile) return;
      var color = TONE[it.tone] || '#8b909b';
      var valEl = tile.querySelector('[data-value]');
      var lvlEl = tile.querySelector('[data-level]');
      var fillEl = tile.querySelector('[data-fill]');
      var statusEl = tile.querySelector('[data-status]');
      var degraded = it.sourceStatus === 'fallback' || it.fallbackUsed || it.timelinessStatus === 'stale' || !['nominal'].includes(it.qualityStatus);
      tile.dataset.degraded = degraded ? 'true' : 'false';
      if (valEl) {
        valEl.textContent = it.value != null ? it.value : '—';
        valEl.style.color = color;
      }
      if (lvlEl) {
        lvlEl.textContent = it.level || '';
        lvlEl.style.color = color;
      }
      if (fillEl) {
        fillEl.style.width = clampPct(it.value, it.scale) + '%';
        fillEl.style.background = color;
      }
      if (statusEl) statusEl.textContent = statusText(it);
    });
    var upd = document.getElementById('risk-updated');
    if (upd) {
      try {
        var d = formatDate(data.aggregateGeneratedAt || data.updated || data.generated, true);
        var count = data.indices.filter(function (item) {
          return item && (item.sourceStatus === 'fallback' || item.fallbackUsed || item.timelinessStatus === 'stale' || item.qualityStatus !== 'nominal');
        }).length;
        upd.textContent = d
          ? ' Assemblage ' + d + (data.status === 'degraded' ? ' · état dégradé visible' + (count ? ' (' + count + ')' : '') : '') + '.'
          : '';
      } catch (e) {}
    }
  }

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
})();
