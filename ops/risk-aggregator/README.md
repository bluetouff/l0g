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

## Correspondance entre GitHub et le serveur

`producer-deployment.json` relie chaque producteur à une révision Git complète
et aux SHA-256 des fichiers réellement exécutés. Cette déclaration n'est pas
prise sur confiance : `verify-producer-deployment.py` relit les fichiers sous
`/opt` et bloque l'installation au premier écart. Une mise à jour de producteur
doit donc modifier ensemble sa révision et les empreintes de ses points d'entrée
et dépendances locales.

## Installation serveur

Le script d'installation effectue une migration atomique et réversible :

1. il vérifie les cinq producteurs avant d'annoncer leurs révisions ;
2. il crée une release immuable dans `/usr/local/lib/l0g-risk-<revision>` ;
3. il remplace le lien `/usr/local/lib/l0g-risk` atomiquement ;
4. il réinitialise `ExecStart` et `ExecStartPost`, y compris si un ancien
   `override.conf` ajoute encore les scripts de `/usr/local/bin` ;
5. il sauvegarde unités, drop-ins et données, puis restaure l'ensemble si
   systemd ou le contrat de sortie échoue.

Depuis un checkout propre correspondant au code à activer :

```sh
git status --short
revision=$(git rev-parse HEAD)
sudo ops/risk-aggregator/verify-producer-deployment.py \
  ops/risk-aggregator/producer-deployment.json
sudo ops/risk-aggregator/install-server.sh "$revision"
```

Le contrôle préliminaire échoue volontairement si un producteur n'a pas encore
été mis à la révision inscrite dans le manifeste. Il faut alors déployer ce
producteur depuis son propre dépôt, le relancer et recommencer la vérification.

Vérifications obligatoires après activation :

```sh
systemctl status l0g-risk.service --no-pager
journalctl -u l0g-risk.service -n 50 --no-pager
systemctl cat l0g-risk.service --no-pager
curl -fsS https://l0g.fr/risk.json | jq '{generated,status,summary,indices}'
curl -fsS https://l0g.fr/api/v1/history.ndjson | tail -n 1 | jq .
```

Le déploiement ne doit être déclaré réussi que si les cinq signaux sont
présents, les dates sont distinctes et un test de panne contrôlé publie bien
`sourceStatus=fallback` sans modifier `lastSuccessAt`.

`producerRevisionStatus=reported` ne doit être configuré qu'après comparaison
du code réellement activé avec la révision Git correspondante. Une simple
branche distante ou un build vert ne suffit pas.
