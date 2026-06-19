/* Initialise la recherche Pagefind sur tous les champs .pf-search.
   Fichier servi depuis l'origine du site (self) pour rester compatible
   avec une CSP stricte sans 'unsafe-inline'. */
(function () {
  function initPagefind() {
    if (!window.PagefindUI) return;
    document.querySelectorAll('.pf-search').forEach(function (el) {
      if (el.dataset.pfReady) return;
      el.dataset.pfReady = '1';
      new window.PagefindUI({
        element: el,
        showImages: false,
        showSubResults: true,
        translations: { placeholder: 'Rechercher\u2026' },
      });
      // Entrée -> page de résultats dédiée (sauf sur /recherche elle-même).
      if (!el.classList.contains('pf-page')) {
        el.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter') return;
          var input = el.querySelector('.pagefind-ui__search-input');
          var q = input && input.value.trim();
          if (q) {
            e.preventDefault();
            window.location.href = '/recherche/?q=' + encodeURIComponent(q);
          }
        });
      }
    });
  }
  if (document.readyState !== 'loading') initPagefind();
  else document.addEventListener('DOMContentLoaded', initPagefind);
})();
