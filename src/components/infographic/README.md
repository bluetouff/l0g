# Infographies l0g

Composants réutilisables pour les infographies d'article, à la charte du site.
Ils fournissent une base commune pour la palette, les légendes et l'espace sous
le graphe. La composition reste adaptée au mécanisme ou à la comparaison.

## Direction graphique

Une infographie doit rendre une information plus facile à comprendre. Choisir
le graphique selon la question, puis retirer les éléments qui ne servent pas
sa lecture : cadres imbriqués, pictogrammes décoratifs et répétitions de texte.

- Utiliser la sans de lecture Inter disponible dans la charte pour les nouveaux
  composants. Une famille existante avec des métriques vérifiées peut être
  conservée pour les figures d'archive.
- Préférer les graisses 400 et 500. Le gras ne constitue pas une hiérarchie à
  lui seul : la position, l'espace et la taille doivent guider le regard.
- Réserver l'accent à l'information principale. Employer les autres couleurs
  seulement lorsqu'elles distinguent une donnée ou une catégorie utile.
- Dessiner des traits fins mais suffisamment contrastés. Alléger les aplats
  et conserver des marges généreuses autour des libellés.
- Prévoir une composition mobile, sans simplement réduire un grand dessin.
  Conserver unités, dates, sources, limites et proportions des données.
- Examiner les rendus dans l'article complet, en thèmes clair et sombre et à
  largeur mobile. La validation XML et les tests géométriques les complètent.

Les figures `prices`, `risk` et `maturities` de `src/figures/compute-price/`
illustrent trois compositions : comparaison ouverte, circuit sans cadres
imbriqués et échéancier à barres fines. Leurs variantes FR/EN conservent les
mêmes chiffres et références documentaires.

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
  fontScale={1.5}
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
- `fontScale` : facteur optionnel de 0,75 à 1,6 pour renforcer la lisibilité
  des libellés, notamment dans les SVG denses affichés sur mobile.

## Tons disponibles

`signal` (teal), `blue`, `amber`, `accent` (rose), `muted` (gris). Fond, lignes
et textes utilisent les variables de la charte et suivent le thème choisi.
