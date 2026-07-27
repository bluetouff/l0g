/* Recherche Pagefind locale, versionnée par le build et rendue avec les API DOM sûres.
   Aucun innerHTML ni parseur HTML : compatible avec Trusted Types en mode strict. */
(function () {
  'use strict';

  var pagefindPromise;

  function createElement(name, className, text) {
    var element = document.createElement(name);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function safeLocalHref(value) {
    try {
      var parsed = new URL(String(value || ''), window.location.origin);
      if (parsed.origin !== window.location.origin) return null;
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
      return parsed.pathname + parsed.search + parsed.hash;
    } catch (error) {
      return null;
    }
  }

  function loadPagefind() {
    if (!pagefindPromise) {
      pagefindPromise = import('/pagefind/pagefind.js').then(function (pagefind) {
        // Worker(url) est lui-même un sink TrustedScriptURL. Pagefind reçoit
        // donc l'option avant son initialisation et exécute son WASM local sur
        // le thread principal, sans politique Trusted Types passe-partout.
        return pagefind.options({ noWorker: true })
          .then(function () { return pagefind.init(); })
          .then(function () { return pagefind; });
      });
    }
    return pagefindPromise;
  }

  function appendResultLink(parent, data, nested) {
    var href = safeLocalHref(data && data.url);
    if (!href) return;

    var item = createElement('li', nested ? 'pagefind-ui__result-nested' : 'pagefind-ui__result');
    var title = createElement('p', 'pagefind-ui__result-title');
    var link = createElement(
      'a',
      'pagefind-ui__result-link',
      String((data.meta && data.meta.title) || data.title || href)
    );
    link.href = href;
    title.appendChild(link);
    item.appendChild(title);

    var excerptText = String(data.plain_excerpt || '').replace(/\s+/g, ' ').trim();
    if (excerptText) {
      item.appendChild(createElement('p', 'pagefind-ui__result-excerpt', excerptText));
    }

    var date = data.meta && data.meta.date;
    if (!nested && date) {
      var tags = createElement('div', 'pagefind-ui__result-tags');
      tags.appendChild(createElement('span', 'pagefind-ui__result-tag', String(date)));
      item.appendChild(tags);
    }

    if (!nested && Array.isArray(data.sub_results) && data.sub_results.length) {
      var subResults = createElement('ol', 'pagefind-ui__result-sublist');
      data.sub_results.slice(0, 3).forEach(function (subResult) {
        appendResultLink(subResults, subResult, true);
      });
      if (subResults.childElementCount) item.appendChild(subResults);
    }

    parent.appendChild(item);
  }

  function initSearch(container, index) {
    if (container.dataset.pfReady) return;
    container.dataset.pfReady = '1';

    var root = createElement('div', 'pagefind-ui');
    var form = createElement('form', 'pagefind-ui__form');
    form.setAttribute('role', 'search');

    var inputId = 'pagefind-search-' + index;
    var label = createElement('label', 'sr-only', 'Rechercher dans l0g');
    label.htmlFor = inputId;

    var input = createElement('input', 'pagefind-ui__search-input');
    input.id = inputId;
    input.type = 'search';
    input.autocomplete = 'off';
    input.placeholder = 'Rechercher\u2026';
    input.setAttribute('enterkeyhint', 'search');
    input.setAttribute('spellcheck', 'false');

    var clear = createElement('button', 'pagefind-ui__search-clear', 'Effacer');
    clear.type = 'button';
    clear.hidden = true;

    var message = createElement('p', 'pagefind-ui__message');
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');

    var results = createElement('ol', 'pagefind-ui__results');
    var more = createElement('button', 'pagefind-ui__more', 'Afficher plus');
    more.type = 'button';
    more.hidden = true;

    form.append(label, input, clear);
    root.append(form, message, results, more);
    container.appendChild(root);

    var debounceTimer = null;
    var searchToken = 0;
    var currentResponse = null;
    var rendered = 0;
    var batchSize = 20;

    function resetResults() {
      currentResponse = null;
      rendered = 0;
      results.replaceChildren();
      message.textContent = '';
      more.hidden = true;
    }

    async function renderNext(token) {
      if (!currentResponse || token !== searchToken) return;
      var from = rendered;
      var to = Math.min(from + batchSize, currentResponse.results.length);
      var batch = currentResponse.results.slice(from, to);
      more.hidden = true;

      try {
        var documents = await Promise.all(batch.map(function (result) { return result.data(); }));
        if (token !== searchToken) return;
        documents.forEach(function (document) { appendResultLink(results, document, false); });
        rendered = to;
        more.hidden = rendered >= currentResponse.results.length;
      } catch (error) {
        if (token === searchToken) {
          message.textContent = 'Les résultats ne peuvent pas être affichés pour le moment.';
        }
      }
    }

    async function runSearch() {
      var query = input.value.trim();
      var token = ++searchToken;
      clear.hidden = !query;

      if (!query) {
        resetResults();
        return;
      }

      currentResponse = null;
      rendered = 0;
      results.replaceChildren();
      more.hidden = true;
      message.textContent = 'Recherche en cours\u2026';

      try {
        var pagefind = await loadPagefind();
        var response = await pagefind.search(query);
        if (token !== searchToken) return;
        currentResponse = response;
        var count = response.results.length;
        message.textContent = count
          ? count + ' résultat' + (count > 1 ? 's' : '') + ' pour « ' + query + ' »'
          : 'Aucun résultat pour « ' + query + ' »';
        if (count) await renderNext(token);
      } catch (error) {
        if (token === searchToken) {
          message.textContent = 'La recherche locale est momentanément indisponible.';
        }
      }
    }

    function scheduleSearch() {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(runSearch, 180);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      window.clearTimeout(debounceTimer);
      runSearch();
    });
    input.addEventListener('input', scheduleSearch);
    input.addEventListener('focus', function () {
      loadPagefind().catch(function () {
        message.textContent = 'La recherche locale est momentanément indisponible.';
      });
    }, { once: true });
    input.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      input.value = '';
      clear.hidden = true;
      ++searchToken;
      resetResults();
    });
    clear.addEventListener('click', function () {
      input.value = '';
      clear.hidden = true;
      ++searchToken;
      resetResults();
      input.focus();
    });
    more.addEventListener('click', function () { renderNext(searchToken); });
  }

  function start() {
    document.querySelectorAll('.pf-search').forEach(initSearch);
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
