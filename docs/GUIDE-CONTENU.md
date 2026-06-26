# Guide de contenu — l0g.fr

Tout ce qu'il faut pour publier sans réfléchir à la technique. Trois types de
contenu : les **articles** (le journal), les **pages** (contenu fixe, ex. « à
propos »), et la **colonne de droite** (liens, mini-graphe, about).

---

## 0. Où vivent les choses

```
src/
├── content/posts/      → les articles (.md ou .mdx)
├── pages/              → les pages fixes (.astro)
├── config/sidebar.ts   → le contenu de la colonne de droite
└── components/         → les composants réutilisables (graphes, widgets)
```

Le flux de publication, en une phrase : tu écris en local, tu prévisualises, tu
`git push`, et le serveur récupère et met en ligne tout seul en 2 minutes.

---

## 1. Publier un article

### 1.1 Créer le fichier

Crée un fichier dans `src/content/posts/`. Le nom du fichier devient l'URL :

```
src/content/posts/private-credit-stress.md   →   https://l0g.fr/posts/private-credit-stress/
```

Choisis l'extension selon le besoin :

- **`.md`** : texte seul (le plus simple).
- **`.mdx`** : texte + graphes/widgets interactifs. À utiliser dès que tu veux un
  graphe TradingView dans l'article (voir section 2).

### 1.2 Le frontmatter (obligatoire en tête de fichier)

```yaml
---
title: "Titre de l'article"
description: "Résumé court : sert à la liste, au SEO et au flux RSS."
pubDate: 2026-06-09T14:30:00+02:00
tags: ["macro", "private credit"]
draft: false
---
```

| Champ         | Rôle                                                        |
|---------------|-------------------------------------------------------------|
| `title`       | Titre affiché.                                              |
| `description` | Résumé (liste d'accueil + RSS + partage).                  |
| `pubDate`     | Date de publication. Utilise de préférence le format complet `AAAA-MM-JJTHH:mm:ss+02:00` pour trier correctement plusieurs articles publiés le même jour. Le format court `AAAA-MM-JJ` reste accepté. |
| `updatedDate` | Optionnel, date de mise à jour.                            |
| `tags`        | Liste de tags.                                              |
| `draft`       | `true` = invisible sur le site (brouillon). `false` = publié. |

### 1.3 Écrire

Sous le frontmatter, du markdown classique :

```markdown
## Un sous-titre

Un paragraphe avec un [lien](https://fred.stlouisfed.org) et du `code inline`.

- une puce
- une autre

> Une citation.
```

Le rendu reprend automatiquement le thème terminal (titres VT323, puces `[*]`,
liens cyan, etc.). Tu n'as rien à styler.

---

## 2. Ajouter un graphe ou un widget dans un article

**Le fichier doit être en `.mdx`** (pas `.md`). En haut du fichier, sous le
frontmatter, importe les composants une seule fois :

```mdx
import TradingViewChart from '../../components/TradingViewChart.astro';
import MiniSymbol from '../../components/MiniSymbol.astro';
```

Ensuite, place-les n'importe où dans le texte.

### 2.1 Graphe complet (Advanced Chart)

```mdx
<TradingViewChart symbol="BINANCE:BTCUSDT" interval="240" caption="BTC/USDT — 4h" />
```

Options disponibles :

| Prop       | Défaut             | Exemple                                  |
|------------|--------------------|------------------------------------------|
| `symbol`   | `BINANCE:BTCUSDT`  | `NASDAQ:NVDA`, `FRED:GDP`, `TVC:DXY`     |
| `interval` | `D` (journalier)   | `60`, `240` (minutes), `D`, `W`, `M`     |
| `height`   | `480`              | `360`, `600`                             |
| `caption`  | (aucune)           | `"Texte sous le graphe"`                 |

Le `symbol` suit le format `BOURSE:TICKER`. Pour le trouver : cherche l'actif sur
tradingview.com, le symbole complet est affiché en haut du graphe.

### 2.2 Mini-aperçu (compact)

```mdx
<MiniSymbol symbol="TVC:US10Y" dateRange="12M" />
```

`dateRange` accepte `1D`, `1M`, `3M`, `12M`, `60M`, `ALL`.

### 2.3 Le bandeau de cotations en haut de page

Il est global (toutes les pages). Pour changer les actifs affichés, édite la
liste `symbols` dans `src/components/TickerTape.astro`.

---

## 3. Créer une page fixe (hors journal)

Pour une page comme « à propos », « mentions », etc. : crée un fichier `.astro`
dans `src/pages/`. Le nom devient l'URL (`src/pages/a-propos.astro` →
`/a-propos/`).

Modèle minimal :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="À propos" description="Qui je suis et ce que je publie ici.">
  <article class="prose max-w-2xl">
    <h2>À propos</h2>
    <p>Ton texte ici.</p>
  </article>
</BaseLayout>
```

La colonne de droite, le header et le footer s'ajoutent automatiquement (gérés
par `BaseLayout`).

### Page fixe AVEC un graphe

Les pages `.astro` peuvent importer les mêmes composants :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TradingViewChart from '../components/TradingViewChart.astro';
---

<BaseLayout title="Watchlist">
  <article class="prose max-w-2xl">
    <h2>Watchlist</h2>
    <TradingViewChart symbol="BINANCE:ETHUSDT" interval="D" height={520} />
  </article>
</BaseLayout>
```

### Ajouter la page au menu

Pour qu'elle apparaisse dans la navigation, ajoute un lien dans le `<nav>` de
`src/layouts/BaseLayout.astro` :

```html
<a href="/a-propos/" class="link-term">à propos</a>
```

---

## 4. Éditer la colonne de droite

Tout le contenu de la colonne se règle dans **un seul fichier** :
`src/config/sidebar.ts`.

```ts
// Mini-graphe en haut de colonne (desktop). null = pas de graphe.
export const sidebarMarketSymbol = 'BINANCE:BTCUSDT';

// Liens listés dans la colonne.
export const sidebarLinks = [
  { label: 'US macro dashboard', href: 'https://us.l0g.fr' },
  { label: '13flow', href: 'https://13flow.eu' },
];

// Bloc « about ».
export const sidebarAbout = "Journal de Bluetouff. Macro, crypto, finance...";
```

### Comportement desktop / mobile

- **Desktop (écran large)** : colonne collante à droite du texte, avec le
  mini-graphe, les liens et le about.
- **Mobile** : la colonne disparaît en tant que colonne. Les **liens** et le
  **about** réapparaissent en bloc compact sous l'article (le mini-graphe, lui,
  est volontairement masqué pour ne pas alourdir la page mobile).

Ce comportement est géré par les classes responsive de Tailwind (préfixe `lg:`),
il n'y a pas de fichier `mobile.css` séparé : les styles de base sont déjà ceux
du mobile, et `lg:` ajoute la mise en page desktop par-dessus. Pour ajuster le
point de bascule ou ce qui s'affiche où, c'est dans
`src/layouts/BaseLayout.astro` (le bloc `lg:grid`) et dans
`src/components/SidebarMobile.astro`.

---

## 5. Le processus de publication, pas à pas

### 5.1 Prévisualiser en local

```bash
npm run dev
```

Ouvre http://localhost:4321. La page se recharge à chaque sauvegarde.

> La **recherche** (Pagefind) ne fonctionne qu'après un build. Pour la tester :
> ```bash
> npm run build
> npm run preview
> ```

### 5.2 Publier

```bash
git add .
git commit -m "post: stress du private credit"
git push
```

C'est tout. À partir de là :

1. GitHub reconstruit le site automatiquement (onglet **Actions** du dépôt pour
   suivre).
2. Si le build passe, l'artefact est publié sur la branche `built`.
3. Le serveur récupère la nouvelle version dans les 2 minutes et la met en ligne.

### 5.3 Vérifier le déploiement (sur le serveur, optionnel)

```bash
systemctl status l0g-deploy.timer      # le timer tourne
journalctl -u l0g-deploy.service -n 20 # logs du dernier déploiement
```

### Filet de sécurité

Si un build casse (erreur de syntaxe, etc.), l'action GitHub échoue et **rien
n'est publié** : l'ancienne version reste en ligne. Tu corriges, tu re-pushes.

---

## 6. Astuces

- **Brouillon** : mets `draft: true` dans le frontmatter. L'article reste
  invisible en ligne mais tu le vois en `npm run dev` si besoin de le rendre
  visible localement (il est exclu du build de prod).
- **Images** : pose-les dans `public/` (ex. `public/img/schema.png`) et
  référence-les par `/img/schema.png`. Elles ne sont pas optimisées
  automatiquement dans cette config, garde-les raisonnables.
- **Symbole TradingView introuvable** : si un graphe reste blanc, c'est presque
  toujours un `symbol` mal orthographié. Vérifie le format `BOURSE:TICKER` sur
  tradingview.com.
- **Avant de pousser**, un dernier `npm run build` en local attrape les erreurs
  avant même GitHub.
