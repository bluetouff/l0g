/* Tableau de confluence triable, alimenté par /confluence.json (même origine).
   Injection en textContent uniquement, couleurs issues d'une table fixe : aucun
   risque d'injection même si le JSON était hostile. Aucun appel tiers. */
(function () {
  var QUADRANT = {
    conviction: '#5eead4',
    'institutional bid': '#7aa2f7',
    institutional: '#7aa2f7',
    'insider conviction': '#ff4d87',
    insider: '#ff4d87',
    distribution: '#f5b13d',
    divergent: '#8b909b',
    neutral: '#8b909b',
  };
  function qColor(q) { return QUADRANT[String(q || '').toLowerCase()] || '#5eead4'; }

  var body = document.querySelector('[data-conf-body]');
  var head = document.querySelector('.conf-table thead');
  var updEl = document.querySelector('[data-conf-updated]');
  if (!body) return;

  var rows = [];
  var sortKey = 'score';
  var sortDir = 'desc';

  function fmt(v) { return v == null ? '\u2014' : v; }

  function cell(tag, txt, cls) {
    var el = document.createElement(tag);
    if (txt != null) el.textContent = txt;
    if (cls) el.className = cls;
    return el;
  }

  function paint() {
    var sorted = rows.slice().sort(function (a, b) {
      var x = a[sortKey], y = b[sortKey];
      if (x == null) return 1;
      if (y == null) return -1;
      if (typeof x === 'string') { x = x.toLowerCase(); y = String(y).toLowerCase(); }
      if (x < y) return sortDir === 'asc' ? -1 : 1;
      if (x > y) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    body.textContent = '';
    sorted.forEach(function (it, i) {
      var tr = document.createElement('tr');
      var color = qColor(it.quadrant);
      tr.style.setProperty('--q', color);

      tr.appendChild(cell('td', String(i + 1), 'cf-rank num'));
      tr.appendChild(cell('td', it.ticker || '\u2014', 'cf-tk'));

      // Score : valeur + barre de progression
      var std = document.createElement('td');
      std.className = 'cf-score';
      var wrap = document.createElement('div');
      wrap.className = 'cf-score-wrap';
      var val = cell('span', it.score != null ? it.score : '\u2014', 'cf-score-val');
      val.style.color = color;
      var bar = document.createElement('span');
      bar.className = 'cf-bar';
      var fill = document.createElement('span');
      fill.className = 'cf-bar-fill';
      var pct = it.score != null ? Math.max(0, Math.min(100, Number(it.score))) : 0;
      fill.style.width = pct + '%';
      fill.style.background = color;
      bar.appendChild(fill);
      wrap.appendChild(val);
      wrap.appendChild(bar);
      std.appendChild(wrap);
      tr.appendChild(std);

      // Quadrant
      var qtd = document.createElement('td');
      qtd.className = 'cf-quad';
      var badge = cell('span', (it.quadrant || '\u2014'), 'q');
      badge.style.color = color;
      badge.style.borderColor = color;
      qtd.appendChild(badge);
      tr.appendChild(qtd);

      // Flux de fonds et signaux initiés
      var fp = cell('td', fmt(it.funds), 'num');
      if (Number(it.funds) > 0) fp.classList.add('cf-pos');
      tr.appendChild(fp);

      var fn = cell('td', fmt(it.trimming), 'num');
      if (Number(it.trimming) > 0) fn.classList.add('cf-neg');
      tr.appendChild(fn);

      var ins = cell('td', fmt(it.insiders), 'num');
      if (Number(it.insiders) > 0) ins.classList.add('cf-sig');
      tr.appendChild(ins);

      var cs = cell('td', fmt(it.csuite), 'num');
      if (Number(it.csuite) > 0) cs.classList.add('cf-sig');
      tr.appendChild(cs);

      tr.appendChild(cell('td', fmt(it.age), 'num cf-muted'));
      body.appendChild(tr);
    });
  }

  function wireSort() {
    if (!head) return;
    head.querySelectorAll('.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.getAttribute('data-key');
        var type = th.getAttribute('data-type');
        if (sortKey === key) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortKey = key;
          sortDir = type === 'str' ? 'asc' : 'desc';
        }
        head.querySelectorAll('.sortable').forEach(function (h) { h.removeAttribute('data-active'); });
        th.setAttribute('data-active', sortDir);
        paint();
      });
    });
  }

  fetch('/confluence.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.items)) {
        body.textContent = '';
        body.appendChild(cell('tr', null)).appendChild(
          cell('td', 'Données indisponibles.', 'px-3 py-6 text-center text-muted')
        ).colSpan = 9;
        return;
      }
      rows = data.items;
      if (updEl && data.updated) {
        try {
          updEl.textContent = 'Dernière mise à jour : ' +
            new Date(data.updated).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
        } catch (e) {}
      }
      wireSort();
      paint();
    })
    .catch(function () {
      body.textContent = '';
      var tr = document.createElement('tr');
      var td = cell('td', 'Données indisponibles.', 'px-3 py-6 text-center text-muted');
      td.colSpan = 9;
      tr.appendChild(td);
      body.appendChild(tr);
    });
})();
