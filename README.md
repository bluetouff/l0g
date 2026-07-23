# l0g.fr

Journal statique (Astro 7 + Tailwind v4), édité en Markdown/MDX, versionné sur
GitHub, déployé en pull-based sur un serveur Debian/Apache qui ne sert que du
HTML. Infographies locales, recherche Pagefind, RSS, sitemap, aucun tracker.

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

## Surfaces publiques

l0g publie aussi des surfaces lisibles par machine, utilisées par les agents IA
et par les dashboards :

- `/agents.json` : manifeste de découverte pour agents.
- `/openapi.json` : contrat OpenAPI 3.1 de l'API publique.
- `/api/v1/risk-diff.json` : diff du risque sur 1, 7 et 30 jours
  (signaux, sources, claims, modèles, articles et confiance).
- `/api/v1/black-box.json` : frames point-in-time hashées pour rejouer
  l'état public du risque sans reconstruction rétroactive.
- `/api/v1/risk.json` : signaux de risque normalisés par instrument.
- `/api/v1/debt-risk.json` : snapshot canonique Dette US repris de Debt Risk
  Radar `latest.json`, avec provenance, buckets et couverture lorsque disponible.
- `/api/v1/signals/history.*` : historique point-in-time pour backtests et
  replay sans look-ahead bias.
- `/api/v1/signals/{slug}/chart.svg` : graphique autonome 1200 × 630 d'une
  série nommée, avec source et attribution CC BY 4.0 intégrées.
- `/ressources-journalistes/` et `/en/press-resources/` : graphiques, exports,
  code d'intégration, citations recommandées et limites de réutilisation.
- `/api/mcp/compact` : façade MCP recommandée à six outils, avec découverte,
  recherche, documents, preuves, research packs et état du risque.
- `/api/mcp` : surface MCP complète en lecture seule, conservée pour compatibilité
  et usages experts autour d'Agent Surface, Risk Diff, Black Box, claims, sources,
  intégrité et changefeed.
- `/api/v1/toolset-manifest.json` : versions et empreintes anti-dérive des contrats
  d'outils MCP complet et compact.
- `/llms.txt` et `/llms-full.txt` : cartes textuelles pour agents et RAG.

Les détails de calcul et les limites de modèle sont dans
[`docs/MODELES-RISQUE.md`](docs/MODELES-RISQUE.md) et dans
`/methodologie/`.

## Outil interne de revue des claims

L'UI de revue humaine des assertions (tooling d’admin) est volontairement
isolée du site public et du MCP. Elle n'est pas exposée publiquement :

- serveur local: `127.0.0.1:4317`
- endpoint principal: `http://127.0.0.1:4317/`

Lancement :

```bash
node scripts/review-claims.mjs
```

Le mode commit reste strictement en terminal :

```bash
node scripts/review-claims.mjs --commit [--dry-run] [--push] --message "..." 
```

Détails sécurité côté local :

- seul localhost est accepté,
- toutes les mutations API (`/api/review`, `/api/remove`) exigent JSON + token anti-CSRF propre à la session (`x-review-token`),
- validation de payload (longueurs/champs),
- anti-spam local par fenêtre de temps sur les routes de mutation,
- commit Git en mode interactif terminal uniquement avec confirmation explicite `CONFIRMER`.

Le MCP public et les endpoints de production ne sont pas affectés par ces options.

### Dépannage rapide

En cas d’erreur dans l’UI de revue :

1. **Requête rejetée avec `Token de sécurité manquant ou invalide`**
   - Rafraîchis la page (`Cmd/Ctrl + R`) puis rejoue l’action.
   - Si ça persiste, arrête puis relance le service :
     - `Ctrl+C` dans le terminal qui a lancé `node scripts/review-claims.mjs`
     - relance `node scripts/review-claims.mjs`
   - Evite d’avoir plusieurs tabs de cette UI ouvertes.

2. **Erreur `Method not allowed` / 405**
   - Vérifie de ne pas appeler les endpoints de manière manuelle hors UI.
   - Les routes mutantes attendent uniquement `POST` avec JSON.

3. **Erreur `Content-Type invalide: application/json requis`**
   - C’est normal si une requête n’envoie pas `content-type: application/json`.
   - L’UI interne envoie bien ce header.

4. **Erreur de débit (`Trop de requêtes`)**
   - Attends quelques secondes puis reteste ; la limite locale est 30 requêtes / minute.
   - Cela protège le endpoint admin local contre le spam.

5. **Erreur `Requête trop volumineuse` / champs trop longs**
   - Réduis la taille du payload dans le formulaire (note, preuve, localisateur).
   - Le message de commit reste inchangé : il s’agit d’un guard local par design.

### Checklist opérationnelle de maintenance

- Avant de modifier ce flux local :
  - vérifier qu’aucune donnée sensible de production n’est présente sur le poste (workflow git local propre),
  - arrêter le serveur review existant (`Ctrl+C`) avant de relancer la commande,
  - démarrer avec `node scripts/review-claims.mjs`,
  - valider une review test puis vérifier la sortie JSON du serveur (`/api/state`).
- En cas de hardening ou de changement de format de review :
  - relancer un `git status --short`,
  - exécuter `node scripts/review-claims.mjs --commit --dry-run --message "..."`,
  - vérifier le diff affiché n’éditera que `src/config/claim-reviews.json`,
  - exécuter le `commit --dry-run` réel avec `CONFIRMER` uniquement si le diff est conforme.
- Après mise à jour :
  - redémarrer le serveur review local,
  - conserver la trace des événements sécurité récents si nécessaire :
    - `curl -s http://127.0.0.1:4317/api/security-stats`

## Modèles de risque

Deux corrections de modèle sont maintenant reflétées dans les surfaces l0g :

- **Debt Risk Radar** : les projections CBO restent isolées comme vulnérabilité
  structurelle. Le stress courant exclut CBO et impute les familles courantes
  absentes à `50`, au lieu de renormaliser tout le score sur les seules sources
  disponibles. Le prochain snapshot généré depuis `latest.json` expose
  `score.coverage`.
- **US Macro Dashboard** : le moteur ne retient plus mécaniquement le signal le
  plus élevé entre z-score, drift et momentum. Il combine les composantes par
  moyenne pondérée et pénalise les séries qui alertent trop souvent hors fenêtre
  de récession NBER.

Après modification d'un moteur amont, régénérer les artefacts l0g avec
`npm run risk:update`, puis `npm run test:risk-snapshot`,
`npm run test:agent-surface` et `npm run build`.

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

## Ajouter une infographie

Les visuels publiés doivent être locaux : SVG inline dans un fichier `.mdx`,
composant Astro interne ou fichier placé dans `public/infographies/`.

```markdown
![Description accessible du graphique](/infographies/mon-graphique.svg)
```

Les scripts, iframes, images et polices chargés depuis un domaine tiers sont
interdits. Le build de sécurité contrôle cette promesse.

Toute balise `<img>` doit déclarer ses dimensions intrinsèques `width` et
`height`, ainsi que `loading="lazy"` et `decoding="async"`. L'audit de
performance bloque une régression susceptible de provoquer du CLS.

## Déploiement (vue d'ensemble)

### Migration attestée terminée et vérifiée le 21 juillet 2026

- Le workflow CI publie dans `built` uniquement une enveloppe de release
  composée de l'archive statique, du SHA-256, du bundle Sigstore et des
  coordonnées du commit source. Ces coordonnées sont incluses dans
  l'archive attestée et dupliquées à la racine de `built`; le déployeur exige
  leur égalité octet par octet avant toute bascule.
- Le serveur active exclusivement l'archive dont le checksum, l'attestation,
  le workflow signataire, la ref et le commit source ont été vérifiés.
- L'ancien arbre statique de compatibilité a été retiré après vérification en
  production des marqueurs `.last_source_sha` et `.last_built_sha`.

L'index des contrats, runbooks et versions maintenues se trouve dans
[`docs/README.md`](docs/README.md).

1. `git push` sur `main`.
2. GitHub Actions construit `dist/`, crée une archive déterministe de toute la
   sortie, puis l'atteste avec GitHub OIDC et Sigstore.
3. La branche `built` contient uniquement l'archive, son SHA-256, le bundle
   d'attestation et les coordonnées du commit source de `main`.
4. Le timer systemd poll `built` toutes les 2 min.
   Avant toute bascule, il exige
   que le clone corresponde au HEAD distant de `built`, que le SHA source
   corresponde au HEAD distant de `main`, et que `gh attestation verify`
   confirme l'archive, le workflow signataire, la ref et le commit source.
5. L'archive est contrôlée contre les traversées de chemin et les liens, extraite
   dans une release isolée, puis le symlink servi par Apache est basculé
   atomiquement.

Le déploiement statique n'exécute aucune toolchain Node, ne build rien et
n'ouvre aucun port entrant. Le serveur ne possède aucun token GitHub permanent.

## Mise en place serveur (une fois)

```bash
# prérequis de vérification
git --version
gh --version
gh attestation verify --help >/dev/null

# utilisateur dédié
sudo useradd --system --create-home --shell /usr/sbin/nologin l0gdeploy
sudo mkdir -p /var/www/html/l0g && sudo chown l0gdeploy:l0gdeploy /var/www/html/l0g

# installation initiale des unités
sudo install -m 0755 deploy/deploy.sh /usr/local/bin/l0g-deploy.sh
sudo install -m 0644 deploy/l0g-deploy.service /etc/systemd/system/
sudo install -m 0644 deploy/l0g-deploy.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now l0g-deploy.timer
sudo systemctl start l0g-deploy.service

# Apache
sudo a2enmod ssl headers deflate expires rewrite auth_basic authn_file
sudo apt-get install apache2-utils
sudo htpasswd -cB /etc/apache2/l0g-stats.htpasswd bluetouff
sudo chown root:www-data /etc/apache2/l0g-stats.htpasswd
sudo chmod 0640 /etc/apache2/l0g-stats.htpasswd
sudo cp deploy/l0g.fr.apache.conf /etc/apache2/sites-available/
sudo a2ensite l0g.fr.apache.conf
sudo certbot --apache -d l0g.fr -d www.l0g.fr   # ou certonly puis reload
sudo systemctl reload apache2
```

Pour migrer un serveur qui possède déjà l'ancien timer, utiliser plutôt le
script transactionnel. Il sauvegarde le worker et les unités, vérifie le
premier déploiement attesté et restaure automatiquement l'ancien worker, les
unités, le symlink courant et les marqueurs si l'activation échoue :

```bash
sudo deploy/activate-worker.sh
```

Si la version Debian de `gh` ne fournit pas `attestation verify`, suivre le bloc
d'installation depuis le dépôt officiel GitHub dans
[`docs/MCP-RELEASE.md`](docs/MCP-RELEASE.md#migration-unique-de-zen). Tant que
l'archive attestée ou l'outil de vérification manque, le script refuse la
release et conserve le symlink courant.

Contrôles après le premier déploiement attesté :

```bash
sudo systemctl start l0g-deploy.service
sudo systemctl status l0g-deploy.service l0g-deploy.timer --no-pager
sudo journalctl -u l0g-deploy.service -n 100 --no-pager
cat /var/www/html/l0g/.last_source_sha
cat /var/www/html/l0g/.last_built_sha
readlink -f /var/www/html/l0g/current
```

## Mises à jour sans y penser

- **Dépendances** : activer Renovate sur le dépôt. `renovate.json` fusionne
  automatiquement patch/minor quand la CI est verte. Le preset
  `helpers:pinGitHubActionDigests` conserve toutes les Actions sur des SHA
  immuables et ouvre les mises à jour de digest. Les majeures restent en PR
  manuelle. Un build cassé ou une provenance incohérente n'atteint jamais la
  prod : la release courante continue de servir.
- **OS / Apache** : `unattended-upgrades` côté Debian.

## Sécurité, en bref

- Sortie 100% statique, pas de runtime, pas de base de données.
- GitHub ne détient aucune clé d'accès au serveur ; le serveur ne fait que du
  HTTPS sortant.
- La branche `built` n'est pas une autorité seule : son archive doit être
  attestée par `.github/workflows/build.yml` et provenir du HEAD courant de
  `main` au moment de l'activation. Cette vérification est le contrat du nouveau
  déployeur ; l'état transitoire du serveur est documenté plus haut.
- CSP stricte (voir `deploy/l0g.fr.apache.conf`), HSTS, en-têtes durcis.
- Unité de déploiement systemd sandboxée.

## Licences et citation

- code, schémas machine, scripts, tests, workflows et déploiement : **MIT** ;
- textes, données et artefacts éditoriaux : **CC BY 4.0** ;
- métadonnées de citation : [`CITATION.cff`](CITATION.cff) ;
- release stable du protocole :
  [`releases/l0g-editorial-protocol-1.0.0/`](releases/l0g-editorial-protocol-1.0.0/).

Le fichier [`LICENSE`](LICENSE) définit précisément la portée et renvoie aux
deux textes juridiques complets dans `LICENSES/`.

## Ajouter une UI d'édition plus tard (optionnel)

Le site est en édition « git-pur » par choix de sécurité. Pour ajouter une UI
type CMS sans base de données, le plus propre avec Astro est **Keystatic**
(git-based, schémas TypeScript). Cela réintroduit toutefois une route `/admin`
et un flux OAuth GitHub à autoriser dans la CSP — à peser contre le modèle
« zéro runtime » actuel.
