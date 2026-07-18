# Agrégateur de signaux de risque

Ce répertoire est la source de vérité du service serveur qui alimente
`/risk.json`, `/api/v1/risk.json`, `/api/v1/history.ndjson` et le flux Atom.
Il remplace les copies historiques installées manuellement dans
`/usr/local/bin`.

## Contrat best effort

`generated` et `updated` datent l'assemblage. Ils ne prouvent pas la fraîcheur
de chaque producteur. Chaque entrée d'`indices` publie séparément :

- `sourceStatus` : `ok` ou `fallback` ; une source totalement absente figure
  dans `summary.missing` ;
- `sourceUpdatedAt`, `retrievedAt`, `lastAttemptAt`, `lastSuccessAt` ;
- `staleAfter`, `ageSeconds`, `timelinessStatus` ;
- `qualityStatus`, `fallbackUsed`, `fallbackLayer`, `fallbackReason` et
  `warnings`.
- `producerRepository`, `producerRevision` et `producerRevisionStatus` ; le
  bloc racine `software` publie de même la révision et le SHA-256 du code
  d'agrégation réellement exécuté.

Une panne conserve la dernière valeur connue si elle existe. Sa provenance et
son dernier succès sont préservés, tandis que la nouvelle tentative est datée
et le statut global passe à `degraded`. Aucune panne ne peut donc être masquée
par l'horodatage d'assemblage.

Le pétrole reste alimenté gratuitement par le spot quotidien officiel EIA
quand les sources optionnelles plus rapides échouent. Le producteur expose
alors `tip_source=eia` et les dates Brent/WTI ; l'agrégateur le traduit en
`qualityStatus=official-delayed`, sans présenter cette valeur comme du spot
temps réel.

## Test

```sh
python3 -m unittest ops/risk-aggregator/test_risk_aggregator.py
```

## Installation serveur

Prévisualiser d'abord le diff et sauvegarder les fichiers actifs. Les quatre
scripts sont installés dans un répertoire en lecture seule ; seule la donnée
publique reste inscriptible par `l0grisk`.

```sh
sudo install -d -m 0755 /usr/local/lib/l0g-risk
sudo install -m 0755 ops/risk-aggregator/l0g-risk.py /usr/local/lib/l0g-risk/
sudo install -m 0755 ops/risk-aggregator/api-build.py /usr/local/lib/l0g-risk/
sudo install -m 0755 ops/risk-aggregator/risk_history.py /usr/local/lib/l0g-risk/
sudo install -m 0755 ops/risk-aggregator/backfill_history.py /usr/local/lib/l0g-risk/
test -z "$(git status --porcelain -- ops/risk-aggregator)"
printf 'L0G_RISK_REVISION=%s\n' "$(git rev-parse HEAD)" | sudo tee /etc/l0g-risk.env >/dev/null
# Ajouter dans /etc/l0g-risk.env les révisions réellement déployées :
# L0G_US_REVISION=... L0G_EU_REVISION=... L0G_YEN_REVISION=...
# L0G_ENERGIE_REVISION=... L0G_DEBT_REVISION=...
sudo install -m 0644 ops/risk-aggregator/l0g-risk.service /etc/systemd/system/
sudo install -m 0644 ops/risk-aggregator/l0g-risk.timer /etc/systemd/system/
sudo systemd-analyze verify /etc/systemd/system/l0g-risk.service /etc/systemd/system/l0g-risk.timer
sudo systemctl daemon-reload
sudo systemctl restart l0g-risk.service
sudo systemctl enable --now l0g-risk.timer
```

Vérifications obligatoires après activation :

```sh
systemctl status l0g-risk.service --no-pager
journalctl -u l0g-risk.service -n 50 --no-pager
curl -fsS https://l0g.fr/risk.json | jq '{generated,status,summary,indices}'
curl -fsS https://l0g.fr/api/v1/history.ndjson | tail -n 1 | jq .
```

Le déploiement ne doit être déclaré réussi que si les cinq signaux sont
présents, les dates sont distinctes et un test de panne contrôlé publie bien
`sourceStatus=fallback` sans modifier `lastSuccessAt`.

`producerRevisionStatus=reported` ne doit être configuré qu'après comparaison
du code réellement activé avec la révision Git correspondante. Une simple
branche distante ou un build vert ne suffit pas.
