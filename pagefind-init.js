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
        showSubResults: true,
        translations: { placeholder: 'Rechercher\u2026' },
      });
    });
  }
  if (document.readyState !== 'loading') initPagefind();
  else document.addEventListener('DOMContentLoaded', initPagefind);
})();
