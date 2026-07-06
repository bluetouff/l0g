# Infographies l0g

Composants réutilisables pour les infographies d'article, à la charte du site.
Ils remplacent le SVG écrit à la main : palette, padding sous le graphe et gras
des légendes sont gérés une fois pour toutes.

## Usage (fichiers `.mdx` uniquement)

Les composants s'appellent depuis un article en MDX (`.md` classique ne peut pas
importer de composant). Renommer l'article en `.mdx` (le slug ne change pas),
puis importer après le frontmatter :

```mdx
---
title: "..."
---
import InfographicBars from '../../components/infographic/InfographicBars.astro';

<InfographicBars
  title="Le jeton d'un côté, l'acte de l'autre"
  subtitle="Sous-titre optionnel."
  items={[
    { label: "Encaissé", value: 2.72, valueLabel: "2,72 M$", tone: "signal" },
    { label: "Prix payé", value: 1.1, valueLabel: "1,1 M$", tone: "muted" },
  ]}
  note="Ligne d'accent rose optionnelle"
  notes={["Ligne grise 1.", "Ligne grise 2."]}
  source="Sources : ..."
  caption="Légende sous le graphe, le **gras** (ou <strong>) est géré."
/>
```

## Composants

- `Infographic.astro` : enveloppe `<figure>` + `<figcaption>` (gère `**gras**`).
  Base commune, à réutiliser pour tout nouveau type de graphe.
- `InfographicBars.astro` : barres horizontales étiquetées (comparaisons, parts).
  Les valeurs sont mises à l'échelle du `max` (ou du plus grand item).

## Tons disponibles

`signal` (teal), `blue`, `amber`, `accent` (rose), `muted` (gris). Fond, lignes
et textes suivent automatiquement la charte (`#0c0d10`, `#2a2c33`, etc.).
