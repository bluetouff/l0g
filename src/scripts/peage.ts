import { peageSelection } from '../lib/peage.ts';

const root = document.querySelector<HTMLElement>('[data-peage]');
if (root) {
  const proofs = Array.from(root.querySelectorAll<HTMLElement>('[data-proof]'));
  const ids = proofs.map(proof => proof.dataset.proof!);
  const links = Array.from(root.querySelectorAll<HTMLElement | SVGElement>('[data-relation]'));
  const filters = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-layer]'));
  const select = (id: string, focus = false) => {
    const active = proofs.find(proof => proof.dataset.proof === id);
    if (!active) return;
    proofs.forEach(proof => { proof.hidden = proof !== active; });
    links.forEach(link => {
      const selected = link.dataset.relation === id;
      link.classList.toggle('is-selected', selected);
      if (selected) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    const status = root.querySelector<HTMLElement>('[data-selection-status]');
    if (status) status.textContent = `Preuve ${ids.indexOf(id) + 1} sur ${ids.length}`;
    if (focus) {
      active.focus({ preventScroll: true });
      active.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
  };
  root.classList.add('enhanced');
  root.querySelectorAll<HTMLElement>('[data-peage-controls]').forEach(element => { element.hidden = false; });
  select(peageSelection(location.hash, ids) ?? 'dext-serensia');
  links.forEach(link => link.addEventListener('click', event => {
    if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    const id = link.dataset.relation!;
    if (!ids.includes(id)) return;
    event.preventDefault();
    history.pushState(null, '', `#preuve-${id}`);
    select(id, true);
  }));
  window.addEventListener('hashchange', () => {
    const id = peageSelection(location.hash, ids);
    if (id) select(id, true);
  });
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    root.querySelectorAll<HTMLElement | SVGElement>('[data-map-layer]').forEach(item => {
      item.classList.toggle('is-muted', button.dataset.layer !== 'all' && item.dataset.mapLayer !== button.dataset.layer);
    });
  }));
  const exportButton = root.querySelector<HTMLButtonElement>('[data-export-questions]');
  const checks = Array.from(root.querySelectorAll<HTMLInputElement>('[data-request-check]'));
  const updateCount = () => {
    const count = checks.filter(check => check.checked).length;
    if (exportButton) {
      exportButton.textContent = `Exporter ${count === 1 ? 'ma demande' : `mes ${count} demandes`} ↓`;
      exportButton.disabled = count === 0;
    }
  };
  checks.forEach(check => check.addEventListener('change', updateCount));
  if (exportButton) {
    exportButton.hidden = false;
    exportButton.addEventListener('click', () => {
      const selected = checks.filter(check => check.checked).map(check => check.closest<HTMLElement>('[data-request-item]')!);
      if (!selected.length) return;
      const questionText = selected.map(item => {
        const title = item.querySelector('strong')!.textContent!.trim();
        const question = item.querySelector('[data-request-question]')!.textContent!.trim();
        const references = Array.from(item.querySelectorAll<HTMLAnchorElement>('[data-relation]')).map(link => {
          const id = link.dataset.relation!;
          const proof = proofs.find(proof => proof.dataset.proof === id)!;
          const sources = Array.from(proof.querySelectorAll<HTMLAnchorElement>('.evidence-links a')).map(source => {
            const detail = source.parentElement?.querySelector('span')?.textContent ?? '';
            const date = source.parentElement?.querySelector('small')?.textContent ?? '';
            return `- ${source.textContent?.trim()} : ${detail} (${date})\n  ${source.href}`;
          }).join('\n');
          return `${sources}\nLimite de la relation : ${proof.querySelector('.proof-limit p')?.textContent?.trim() ?? ''}`;
        });
        const clauses = Array.from(item.querySelectorAll<HTMLAnchorElement>('[data-exit-ref]')).map(link => {
          const exit = root.querySelector<HTMLElement>(`#sortie-${link.dataset.exitRef}`);
          if (!exit) return '';
          const content = Array.from(exit.querySelectorAll('p')).map(p => p.textContent?.trim()).join('\n');
          const sources = Array.from(exit.querySelectorAll<HTMLAnchorElement>('a')).map(a => `- ${a.textContent?.trim()} : ${a.href}`).join('\n');
          return `Clause : ${exit.querySelector('h3')?.textContent}\n${exit.querySelector('.exit-timing')?.textContent}\n${content}\n${sources}`;
        });
        return `## ${title}\n\n- [ ] Pièce reçue et vérifiée\n\n${question}\n\n${clauses.join('\n\n')}\n\nRéférences :\n${references.join('\n')}`;
      });
      const content = [
        '# Péage · Demandes documentaires',
        `Dossier Dext / Serensia. Sources revues le ${root.dataset.reviewedOn}.`,
        'Questions à adapter à la commande et au service concernés. La sélection ne prouve pas que les pièces ont été obtenues. Aucun envoi automatique.',
        ...questionText,
        'Les pièces publiques citées ne remplacent pas la commande, les avenants et les engagements propres à votre service.\n',
      ].join('\n\n');
      const preview = root.querySelector<HTMLDetailsElement>('[data-export-preview]');
      const text = preview?.querySelector('textarea');
      if (preview && text) {
        text.value = content;
        preview.hidden = false;
      }
      const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'peage-demandes-dext-serensia.md';
      root.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      const status = root.querySelector<HTMLElement>('[data-export-status]');
      if (status) status.textContent = 'Export préparé. Le texte reste aussi disponible ci-dessous.';
    });
  }
}
