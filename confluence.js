/* Remplit le bloc Confluence de la sidebar depuis /confluence.json.
   Servi depuis l'origine du site (self) -> compatible CSP stricte.
   Aucun appel tiers : le navigateur ne lit qu'un fichier local de l0g.fr.
   Injection en textContent uniquement, couleur issue d'une table fixe. */
(function () {
  var QUADRANT = {
    conviction: '#5eead4',          // teal  : 13F + initiés alignés
    'institutional bid': '#7aa2f7', // bleu  : surtout institutionnel
    institutional: '#7aa2f7',
    'insider conviction': '#ff4d87',// rose  : surtout initiés
    insider: '#ff4d87',
    distribution: '#f5b13d',        // ambre : sorties / ventes
    divergent: '#8b909b',
    neutral: '#8b909b',
  };

  function color(q) {
    return QUADRANT[String(q || '').toLowerCase()] || '#5eead4';
  }

  function ctx(it) {
    var parts = [];
    if (it.funds != null) parts.push(it.funds + ' fonds');
    if (it.insiders != null) parts.push(it.insiders + ' init.');
    if (!parts.length && it.quadrant) return it.quadrant;
    return parts.join(' \u00b7 ');
  }

  function render(data) {
    if (!data || !Array.isArray(data.items)) return;
    var rows = document.querySelectorAll('[data-confluence] [data-slot]');
    if (!rows.length) return;
    data.items.slice(0, 5).forEach(function (it, i) {
      var row = rows[i];
      if (!row) return;
      var c0 = color(it.quadrant);
      var t = row.querySelector('[data-ticker]');
      var s = row.querySelector('[data-score]');
      var c = row.querySelector('[data-ctx]');
      if (t) t.textContent = it.ticker || '\u2014';
      if (s) {
        s.textContent = it.score != null ? it.score : '';
        s.style.color = c0;
      }
      if (c) c.textContent = ctx(it);
      row.style.display = 'flex';
    });
  }

  fetch('/confluence.json', { cache: 'no-store' })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .then(render)
    .catch(function () {});
})();
