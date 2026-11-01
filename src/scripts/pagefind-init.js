/* Local Pagefind search. All index and query text is rendered with safe DOM APIs. */
(function () {
  'use strict';
  var pagefindPromise;
  var typeLabels = {
    fr: { analysis: 'Analyse', guide: 'Guide', glossary: 'Définition', tool: 'Outil', dossier: 'Dossier', page: 'Page' },
    en: { analysis: 'Analysis', guide: 'Guide', glossary: 'Definition', tool: 'Tool', dossier: 'Dossier', page: 'Page' }
  };

  function createElement(name, className, text) {
    var element = document.createElement(name);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function safeLocalHref(value) {
    try {
      if (/[\u0000-\u001f\u007f]/.test(String(value || ''))) return null;
      var parsed = new URL(String(value || ''), window.location.origin);
      if (parsed.origin !== window.location.origin || parsed.username || parsed.password) return null;
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
      return parsed.pathname + parsed.search + parsed.hash;
    } catch (error) { return null; }
  }

  function loadPagefind() {
    if (!pagefindPromise) {
      pagefindPromise = import('/pagefind/pagefind.js').then(function (pagefind) {
        // Worker(url) is a TrustedScriptURL sink. Keep the existing strict-CSP contract.
        return pagefind.options({ noWorker: true })
          .then(function () { return pagefind.init(); })
          .then(function () { return pagefind; });
      });
    }
    return pagefindPromise;
  }

  function appendResultLink(parent, data, nested, lang) {
    var href = safeLocalHref(data && data.url);
    if (!href) return;
    var meta = data.meta || {};
    var item = createElement('li', nested ? 'pagefind-ui__result-nested' : 'pagefind-ui__result');
    if (!nested) {
      var tags = createElement('div', 'pagefind-ui__result-tags');
      if (typeLabels[lang][meta.kind]) tags.appendChild(createElement('span', '', typeLabels[lang][meta.kind]));
      var date = new Date(meta.published || '');
      var dateText = Number.isFinite(date.getTime())
        ? date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Paris' })
        : meta.date;
      if (dateText) tags.appendChild(createElement('span', '', String(dateText)));
      if (tags.childElementCount) item.appendChild(tags);
    }
    var title = createElement('p', 'pagefind-ui__result-title');
    var link = createElement('a', 'pagefind-ui__result-link', String(meta.title || data.title || href));
    link.href = href;
    title.appendChild(link);
    item.appendChild(title);
    var excerpt = String(data.plain_excerpt || '').replace(/\s+/g, ' ').trim();
    if (excerpt) item.appendChild(createElement('p', 'pagefind-ui__result-excerpt', excerpt));
    if (!nested && Array.isArray(data.sub_results) && data.sub_results.length) {
      var subResults = createElement('ol', 'pagefind-ui__result-sublist');
      data.sub_results.filter(function (subResult) { return safeLocalHref(subResult.url) !== href; })
        .slice(0, 3).forEach(function (subResult) { appendResultLink(subResults, subResult, true, lang); });
      if (subResults.childElementCount) item.appendChild(subResults);
    }
    parent.appendChild(item);
  }

  function initSearch(container, index) {
    if (container.dataset.pfReady) return;
    container.dataset.pfReady = '1';
    var lang = container.dataset.searchLang === 'en' ? 'en' : 'fr';
    var en = lang === 'en';
    var params = new URLSearchParams(window.location.search);
    var root = createElement('div', 'pagefind-ui');
    var form = createElement('form', 'pagefind-ui__form');
    form.setAttribute('role', 'search');
    var inputId = 'pagefind-search-' + index;
    var label = createElement('label', 'sr-only', en ? 'Search l0g' : 'Rechercher dans l0g');
    label.htmlFor = inputId;
    var input = createElement('input', 'pagefind-ui__search-input');
    input.id = inputId;
    input.type = 'search';
    input.autocomplete = 'off';
    input.placeholder = en ? 'Search\u2026' : 'Rechercher\u2026';
    input.maxLength = 2000;
    input.value = (params.get('q') || '').slice(0, 2000);
    input.setAttribute('enterkeyhint', 'search');
    input.setAttribute('spellcheck', 'false');
    var clear = createElement('button', 'pagefind-ui__search-clear', en ? 'Clear' : 'Effacer');
    clear.type = 'button';
    clear.hidden = !input.value;
    var message = createElement('p', 'pagefind-ui__message');
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    var results = createElement('ol', 'pagefind-ui__results');
    var more = createElement('button', 'pagefind-ui__more', en ? 'Show more' : 'Afficher plus');
    more.type = 'button';
    more.hidden = true;
    var filters = createElement('div', 'search-filters');
    function selectField(name, title, allLabel) {
      var wrapper = createElement('label', 'search-filter', title);
      var select = createElement('select');
      select.name = name;
      select.appendChild(new Option(allLabel, ''));
      select.disabled = true;
      wrapper.appendChild(select);
      filters.appendChild(wrapper);
      return select;
    }
    var typeSelect = selectField('type', 'Format', en ? 'All formats' : 'Tous les formats');
    var topicSelect = selectField('topic', en ? 'Subject' : 'Sujet', en ? 'All subjects' : 'Tous les sujets');
    var yearSelect = selectField('year', en ? 'Year' : 'Année', en ? 'All years' : 'Toutes les années');
    var sortSelect = selectField('sort', en ? 'Order' : 'Trier', en ? 'Relevance' : 'Pertinence');
    sortSelect.appendChild(new Option(en ? 'Newest' : 'Plus récents', 'newest'));
    sortSelect.disabled = false;
    sortSelect.value = params.get('sort') === 'newest' ? 'newest' : '';
    var dateNote = createElement('p', 'search-date-note', en
      ? 'Date filters show dated content only: publication for analyses, revision for guides.'
      : 'Le classement par date et le filtre annuel portent sur les contenus datés : publication des analyses, révision des guides.');
    dateNote.hidden = true;
    var reset = createElement('button', 'search-reset', en ? 'Reset filters' : 'Réinitialiser les filtres');
    reset.type = 'button';
    reset.hidden = true;
    form.append(label, input, clear);
    root.append(form, filters, dateNote, reset, message, results, more);
    container.appendChild(root);

    var debounceTimer = null;
    var searchToken = 0;
    var currentResponse = null;
    var rendered = 0;
    var batchSize = 20;
    var filterReady = loadPagefind().then(function (pagefind) { return pagefind.filters(); }).then(function (available) {
      [
        { name: 'type', select: typeSelect, labels: typeLabels[lang] },
        { name: 'topic', select: topicSelect },
        { name: 'year', select: yearSelect }
      ].forEach(function (field) {
        var values = Object.keys(available[field.name] || {});
        values.sort(field.name === 'year'
          ? function (a, b) { return Number(b) - Number(a); }
          : function (a, b) { return (field.labels ? field.labels[a] || a : a).localeCompare(field.labels ? field.labels[b] || b : b, lang); });
        values.forEach(function (value) { field.select.appendChild(new Option(field.labels ? field.labels[value] || value : value, value)); });
        var requested = params.get(field.name);
        if (values.indexOf(requested) !== -1) field.select.value = requested;
        field.select.disabled = values.length === 0;
      });
    });
    filterReady.catch(function () { message.textContent = en ? 'Local search is temporarily unavailable.' : 'La recherche locale est momentanément indisponible.'; });

    function syncUrl() {
      var state = new URLSearchParams();
      if (input.value.trim()) state.set('q', input.value.trim());
      [typeSelect, topicSelect, yearSelect, sortSelect].forEach(function (select) { if (select.value) state.set(select.name, select.value); });
      var queryString = state.toString();
      window.history.replaceState(null, '', window.location.pathname + (queryString ? '?' + queryString : ''));
      document.querySelectorAll('.search-editions a').forEach(function (link) {
        var path = link.getAttribute('lang') === 'en' ? '/en/search/' : '/recherche/';
        link.href = path + (input.value.trim() ? '?q=' + encodeURIComponent(input.value.trim()) : '');
      });
    }

    function resetResults() {
      currentResponse = null;
      rendered = 0;
      results.replaceChildren();
      message.textContent = '';
      more.hidden = true;
    }

    async function renderNext(token) {
      if (!currentResponse || token !== searchToken) return;
      var to = Math.min(rendered + batchSize, currentResponse.results.length);
      var batch = currentResponse.results.slice(rendered, to);
      more.hidden = true;
      try {
        var documents = await Promise.all(batch.map(function (result) { return result.data(); }));
        if (token !== searchToken) return;
        documents.forEach(function (document) { appendResultLink(results, document, false, lang); });
        rendered = to;
        more.hidden = rendered >= currentResponse.results.length;
      } catch (error) {
        if (token === searchToken) message.textContent = en ? 'Results cannot be displayed at the moment.' : 'Les résultats ne peuvent pas être affichés pour le moment.';
      }
    }

    async function runSearch() {
      var query = input.value.trim();
      var token = ++searchToken;
      clear.hidden = !query;
      var hasFilters = Boolean(typeSelect.value || topicSelect.value || yearSelect.value || sortSelect.value);
      reset.hidden = !hasFilters;
      dateNote.hidden = !yearSelect.value && !sortSelect.value;
      if (!query && !hasFilters) { resetResults(); syncUrl(); return; }
      resetResults();
      message.textContent = en ? 'Searching\u2026' : 'Recherche en cours\u2026';
      try {
        var pagefind = await loadPagefind();
        await filterReady;
        if (token !== searchToken) return;
        var selectedFilters = {};
        [typeSelect, topicSelect, yearSelect].forEach(function (select) { if (select.value) selectedFilters[select.name] = select.value; });
        var options = { filters: selectedFilters };
        if (sortSelect.value === 'newest') options.sort = { date: 'desc' };
        syncUrl();
        var response = await pagefind.search(query || null, options);
        if (token !== searchToken) return;
        currentResponse = response;
        var count = response.results.length;
        message.textContent = en
          ? (count ? count + ' result' + (count > 1 ? 's' : '') : 'No results') + (query ? ' for “' + query + '”' : '')
          : (count ? count + ' résultat' + (count > 1 ? 's' : '') : 'Aucun résultat') + (query ? ' pour « ' + query + ' »' : '');
        if (count) await renderNext(token);
      } catch (error) {
        if (token === searchToken) message.textContent = en ? 'Local search is temporarily unavailable.' : 'La recherche locale est momentanément indisponible.';
      }
    }

    form.addEventListener('submit', function (event) { event.preventDefault(); window.clearTimeout(debounceTimer); runSearch(); });
    input.addEventListener('input', function () { window.clearTimeout(debounceTimer); debounceTimer = window.setTimeout(runSearch, 180); });
    [typeSelect, topicSelect, yearSelect, sortSelect].forEach(function (select) {
      select.addEventListener('change', function () { window.clearTimeout(debounceTimer); runSearch(); });
    });
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { window.clearTimeout(debounceTimer); input.value = ''; runSearch(); }
    });
    clear.addEventListener('click', function () { window.clearTimeout(debounceTimer); input.value = ''; runSearch(); input.focus(); });
    reset.addEventListener('click', function () {
      [typeSelect, topicSelect, yearSelect, sortSelect].forEach(function (select) { select.value = ''; });
      runSearch();
    });
    more.addEventListener('click', function () { renderNext(searchToken); });
    document.querySelectorAll('[data-search-query]').forEach(function (button) {
      button.addEventListener('click', function () { input.value = button.dataset.searchQuery || ''; input.focus(); runSearch(); });
    });
    filterReady.then(function () {
      if (input.value || typeSelect.value || topicSelect.value || yearSelect.value || sortSelect.value) runSearch();
      if (params.get('focus') === '1') input.focus();
    }).catch(function () { /* The filterReady handler sets the visible error. */ });
  }

  function start() { document.querySelectorAll('.pf-search').forEach(initSearch); }
  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
