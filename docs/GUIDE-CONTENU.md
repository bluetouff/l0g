# Guide de contenu l0g.fr

Guide pratique pour publier sans perdre les garde-fous éditoriaux et techniques.
Trois types de contenu : les **articles** (le journal), les **pages** (contenu
fixe, ex. « à propos »), et la **colonne de droite** (liens et about).

La référence normative est
[`l0g Editorial Protocol 1.0`](../releases/l0g-editorial-protocol-1.0.0/README.md).
Elle fixe le typage des affirmations, le lien vers les preuves, les localisateurs,
les limites, les corrections, les licences et les tests de conformité.

---

## 0. Où vivent les choses

```
src/
├── content/posts/      → les articles (.md ou .mdx)
├── pages/              → les pages fixes (.astro)
├── config/sidebar.ts   → le contenu de la colonne de droite
└── components/         → les composants réutilisables et infographies locales
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
- **`.mdx`** : texte + composants Astro locaux. À utiliser pour une infographie
  inline ou un composant interne (voir section 2).

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

### 1.4 Garde-fous éditoriaux

- distinguer fait, estimation, inférence et scénario ;
- rouvrir la source primaire et vérifier chaque chiffre critique ;
- conserver la date de consultation et, si elle est connue, la date de la source ;
- fournir un localisateur exact pour toute preuve directe ;
- exposer les limites de couverture, de retard, de révision ou d'incertitude ;
- terminer une analyse par des sections `Sources` et `Limites` explicites ;
- appliquer CC BY 4.0 aux textes, données et artefacts éditoriaux ;
- dater toute correction qui change la lecture d'un fait, d'une méthode ou d'une conclusion.

Pour produire ou modifier le paquet de référence conforme :

```bash
npm run test:editorial-protocol
(cd releases/l0g-editorial-protocol-1.0.0 && sha256sum -c SHA256SUMS)
```

Ces tests valident la structure, pas la vérité économique ni la fraîcheur future
d'une source.

---

## 2. Ajouter une infographie sans appel tiers

La règle est simple : le navigateur ne doit contacter aucun domaine tiers au
chargement. Utilise l'une de ces formes :

- SVG inline dans un fichier `.mdx` ;
- composant Astro interne sans requête réseau ;
- fichier SVG, PNG ou WebP placé dans `public/infographies/`.

Exemple Markdown :

```markdown
<figure>
  <img src="/infographies/mon-graphique.svg" alt="Description factuelle du graphique" />
  <figcaption>Source : organisme, série, date et calcul éventuel.</figcaption>
</figure>
```

Chaque visuel doit indiquer sa source, sa date, son unité et, si nécessaire, la
méthode de calcul. Les scripts externes, iframes, polices distantes et images
chargées depuis un domaine tiers sont interdits. Le contrôle de sécurité du build
échoue si une ressource HTTP(S) tierce est chargée automatiquement.

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

### Page fixe avec une infographie locale

Les pages `.astro` peuvent importer les mêmes composants :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Watchlist">
  <article class="prose max-w-2xl">
    <h2>Watchlist</h2>
    <img src="/infographies/watchlist.svg" alt="Évolution de la watchlist" />
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
// Liens listés dans la colonne.
export const sidebarLinks = [
  { label: 'US macro dashboard', href: 'https://us.l0g.fr' },
  { label: '13flow', href: 'https://13flow.eu' },
];

// Bloc « about ».
export const sidebarAbout = "Journal de Bluetouff. Macro, crypto, finance...";
```

### Comportement desktop / mobile

- **Desktop (écran large)** : colonne collante à droite du texte, avec les liens
  et le about.
- **Mobile** : la colonne disparaît en tant que colonne. Les **liens** et le
  **about** réapparaissent en bloc compact sous l'article.

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
git status --short
git diff --check
npm run lint:editorial
npm run build
git add chemin/du/fichier.md
git commit -m "post: stress du private credit"
git push origin main
```

Relis toujours le diff indexé avant le commit. À partir du push :

1. GitHub reconstruit le site automatiquement (onglet **Actions** du dépôt pour
   suivre).
2. Si le build passe, l'archive statique complète est attestée puis publiée sur
   la branche `built` avec son bundle de provenance.
3. Le serveur vérifie la correspondance entre `main`, l'attestation et `built`,
   compare les coordonnées intégrées à l'archive, puis extrait celle-ci et
   bascule atomiquement le symlink servi.

### 5.3 Vérifier le déploiement (sur le serveur, optionnel)

```bash
systemctl status l0g-deploy.timer      # le timer tourne
journalctl -u l0g-deploy.service -n 20 # logs du dernier déploiement
cat /var/www/html/l0g/.last_source_sha # commit main attesté et actif
cat /var/www/html/l0g/.last_built_sha  # commit de transport built actif
```

### Filet de sécurité

Avec le nouveau déployeur, si un build casse, si l'attestation est absente ou si
`main` et `built` ne convergent pas, **rien n'est activé** : l'ancienne version
reste en ligne. Cette garantie fail-closed est active en production.

---

## 6. Astuces

- **Brouillon** : mets `draft: true` dans le frontmatter. L'article reste
  invisible en ligne mais tu le vois en `npm run dev` si besoin de le rendre
  visible localement (il est exclu du build de prod).
- **Images** : pose-les dans `public/` (ex. `public/img/schema.png`) et
  référence-les par `/img/schema.png`. Elles ne sont pas optimisées
  automatiquement dans cette config, garde-les raisonnables.
- **Visuel absent** : vérifie que le fichier est bien placé dans `public/`, que
  son chemin commence par `/` et que son texte alternatif décrit le contenu.
- **Avant de pousser**, un dernier `npm run build` en local attrape les erreurs
  avant même GitHub.
