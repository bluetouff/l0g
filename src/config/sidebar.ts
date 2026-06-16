/**
 * Colonne de droite : boutons vers les applications l0g.
 * Édite UNIQUEMENT ce fichier. Alimente Sidebar.astro (desktop) et
 * SidebarMobile.astro. `accent` ∈ teal | blue | pink | amber.
 */
export interface Dashboard {
  label: string;
  sub: string;
  href: string;
  glyph: string;
  accent: 'teal' | 'blue' | 'pink' | 'amber';
}

export const dashboards: Dashboard[] = [
  { label: 'US Macro Dashboard', sub: 'Indicateurs macro & risque', href: 'https://us.l0g.fr', glyph: '🇺🇸', accent: 'teal' },
  { label: 'EU Macro Dashboard', sub: 'Macro européenne & risque', href: 'https://euro.l0g.fr', glyph: '🇪🇺', accent: 'blue' },
  { label: 'Yen Carry Monitor', sub: 'Suivi du yen carry trade', href: 'https://yct.l0g.fr', glyph: '¥', accent: 'pink' },
  { label: 'Energie Monitor', sub: "Marchés de l'énergie", href: 'https://energie.l0g.fr', glyph: '⚡', accent: 'amber' },
];

export const sidebarAbout =
  "Journal de Bluetouff. Macro, crypto, finance. Sources primaires, lecture critique des annonces, et un peu de code pour rendre l'opacité lisible.";
