/* Remplit le bandeau de risque depuis /risk.json.
   Servi depuis l'origine du site (self) -> compatible CSP stricte.
   Aucun appel tiers : le navigateur ne lit qu'un fichier local de l0g.fr. */
(function () {
  var TONE = {
    calm: '#5eead4',     // teal — détendu
    moderate: '#f5b13d', // ambre — modéré
    elevated: '#ff8a3d', // orange — tendu
    crisis: '#ff4d87',   // rose — crise
  };

  function clampPct(value, scale) {
    var s = scale || 100;
    var p = (Number(value) / s) * 100;
    if (isNaN(p)) return 0;
    return Math.max(0, Math.min(100, p));
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
    });
    var upd = document.getElementById('risk-updated');
    if (upd && data.updated) {
      try {
        var d = new Date(data.updated);
        upd.textContent =
          'maj ' +
          d.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
      } catch (e) {}
    }
  }

  fetch('/risk.json', { cache: 'no-store' })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .then(render)
    .catch(function () {});
})();
