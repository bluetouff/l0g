type ProofClick = Pick<MouseEvent, 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'preventDefault'>;
type ProofTarget = Pick<HTMLElement, 'scrollIntoView'>;
type ProofHeading = Pick<HTMLElement, 'focus'>;

/** Move within the current view without replacing the atlas's shareable fragment. */
export function followAtlasProofLink(event: ProofClick, proof: ProofTarget, heading: ProofHeading, reducedMotion: boolean): boolean {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  event.preventDefault();
  proof.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'instant' : 'smooth' });
  heading.focus({ preventScroll: true });
  return true;
}
