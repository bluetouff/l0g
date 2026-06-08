# l0g.fr

Journal statique (Astro 6 + Tailwind v4), édité en Markdown/MDX, versionné sur
GitHub, déployé en pull-based sur un serveur Debian/Apache qui ne sert que du
HTML. Embeds TradingView, recherche Pagefind, RSS, sitemap.

> Pour publier (articles, pages avec graphes, colonne de droite), voir le guide
> pas à pas : [`docs/GUIDE-CONTENU.md`](docs/GUIDE-CONTENU.md).

## Jouer en local

```bash
npm install
npm run dev          # http://localhost:4321
```

Aperçu d'un build de production (nécessaire pour tester la recherche Pagefind) :

```bash
npm run build        # astro build + indexation pagefind
npm run preview
```

## Écrire un article

Créer un fichier dans `src/content/posts/`, en `.md` (texte) ou `.mdx` (texte +
composants). Frontmatter :

```yaml
---
title: "Titre de l'article"
description: "Résumé court (liste + SEO + OG)."
pubDate: 2026-06-08
tags: ["macro", "crypto"]
draft: false        # true = non publié
---
```

L'URL est dérivée du nom de fichier : `mon-article.md` → `/posts/mon-article/`.

## Glisser un graphe ou un widget

Dans un fichier **`.mdx`**, importer le composant puis l'utiliser :

```mdx
import TradingViewChart from '../../components/TradingViewChart.astro';
import MiniSymbol from '../../components/MiniSymbol.astro';

<TradingViewChart symbol="BINANCE:ETHUSDT" interval="240" caption="ETH/USDT — 4h" />

<MiniSymbol symbol="TVC:DXY" dateRange="12M" />
```

Le bandeau de cotations en haut de page se règle dans
`src/components/TickerTape.astro`.

## Déploiement (vue d'ensemble)

1. `git push` sur `main`.
2. GitHub Actions build sur un runner éphémère et publie `dist/` sur la branche
   `built` (via `GITHUB_TOKEN`, sans secret custom).
3. Le timer systemd sur le serveur poll la branche `built` toutes les 2 min, et
   bascule atomiquement le dossier servi si elle a changé.

Le serveur n'a aucune toolchain Node, ne build rien, et n'ouvre aucun port
entrant pour le déploiement.

## Mise en place serveur (une fois)

```bash
# utilisateur dédié
sudo useradd --system --create-home --shell /usr/sbin/nologin l0gdeploy
sudo mkdir -p /var/www/html/l0g && sudo chown l0gdeploy:l0gdeploy /var/www/html/l0g

# script + unités systemd
sudo install -m 0755 deploy/deploy.sh /usr/local/bin/l0g-deploy.sh
sudo install -m 0644 deploy/l0g-deploy.service /etc/systemd/system/
sudo install -m 0644 deploy/l0g-deploy.timer   /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now l0g-deploy.timer
sudo systemctl start l0g-deploy.service   # premier déploiement

# Apache
sudo a2enmod ssl headers deflate expires rewrite
sudo cp deploy/l0g.fr.apache.conf /etc/apache2/sites-available/
sudo a2ensite l0g.fr.apache.conf
sudo certbot --apache -d l0g.fr -d www.l0g.fr   # ou certonly puis reload
sudo systemctl reload apache2
```

## Mises à jour sans y penser

- **Dépendances** : activer Renovate sur le dépôt. `renovate.json` fusionne
  automatiquement patch/minor quand la CI est verte, et épingle les Actions au
  digest SHA. Les majeures restent en PR manuelle. Un build cassé n'atteint
  jamais la prod : l'ancien artefact `built` continue de servir.
- **OS / Apache** : `unattended-upgrades` côté Debian.

## Sécurité, en bref

- Sortie 100% statique, pas de runtime, pas de base de données.
- GitHub ne détient aucune clé d'accès au serveur ; le serveur ne fait que du
  HTTPS sortant.
- CSP stricte (voir `deploy/l0g.fr.apache.conf`), HSTS, en-têtes durcis.
- Unité de déploiement systemd sandboxée.

## Ajouter une UI d'édition plus tard (optionnel)

Le site est en édition « git-pur » par choix de sécurité. Pour ajouter une UI
type CMS sans base de données, le plus propre avec Astro est **Keystatic**
(git-based, schémas TypeScript). Cela réintroduit toutefois une route `/admin`
et un flux OAuth GitHub à autoriser dans la CSP — à peser contre le modèle
« zéro runtime » actuel.
