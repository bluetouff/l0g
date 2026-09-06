# Performance, montée en charge et maintenance

Audit du 6 septembre 2026. Base : `e39c2405a0561b6493ed32eaac9878adc108a17c`.
Compte rendu des mesures locales réalisées avant la publication de `mcp-v1.24.4`. Les autres travaux du checkout sont conservés.

## Priorité constatée

Le site reste statique. La configuration Apache utilise le MPM event et la compression gzip a été vérifiée sur `/`, `/en/` et `/mcp/`. Les ressources Vite versionnées disposent déjà d'un cache immutable. Il n'y a pas de raison mesurée de changer de framework ou d'augmenter les limites Apache pour cette intervention.

Le risque immédiat concerne le chargement du corpus MCP. Avant correction, huit appels simultanés à froid produisent huit objets complets, chacun issu de ses propres lectures et analyses JSON. Le cache existant n'intervient qu'une fois le chargement terminé. Cette situation peut se reproduire à chaque bascule du répertoire de release.

Une lecture des compteurs systemd a relevé un pic mémoire du service MCP égal à sa limite de 256 Mio, avec `NRestarts=0`. Cela justifie de réduire les allocations. Ce relevé ne prouve ni un incident OOM ni sa cause. La mémoire d'un groupe de contrôle Linux et le RSS d'un processus macOS ne sont pas directement comparables.

## Modifications réalisées

1. **Chargement partagé par release** dans `mcp-server/release-cache.mjs`. Les requêtes simultanées attendent le même chargement. Le chemin réel est résolu à chaque appel : déploiement et rollback restent visibles sans délai de cache. Une erreur ne renvoie pas silencieusement le corpus précédent ; elle libère le chargement en cours pour permettre une nouvelle tentative. Une ancienne lecture terminant en retard ne remplace pas le cache de la release courante.
2. **Index du graphe réutilisé** dans `mcp-server/evidence-graph-index.mjs`. Les parcours utilisent des index par origine, destination et type d'arête. Ils conservent l'ordre et les doublons du corpus. Une WeakMap associe l'index à l'objet du graphe, sans conserver indéfiniment les anciennes releases. Les listes partagées sont figées.

Le serveur et le transport MCP restent propres à chaque requête. Les contrôles Host, Origin, taille du corps, quota et fraîcheur financière ne changent pas. Aucune dépendance ajoutée. Les nouveaux modules sont inclus dans la copie des archives, leurs empreintes obligatoires et le contrôle du workflow de publication.

## Mesures locales

Mesures détaillées : [PERFORMANCE-2026-09-06.json](PERFORMANCE-2026-09-06.json).

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Copies du corpus pour 8 lecteurs simultanés | 8 | 1 |
| Chargement à froid, médiane de 3 processus | 419,5 ms | 51,5 ms |
| RSS à la fin de ces chargements, médiane | 673,3 Mio | 166,8 Mio |
| Appel du graphe, médiane sur le corpus comparé | 8,24 ms | 4,99 ms |
| Appel du graphe, 95e percentile | 43,36 ms | 40,03 ms |

Le test de chargement utilise Node 26.0.0 sur macOS, un corpus construit localement et trois essais alternés par version. Le RSS est mesuré à la fin du chargement, pas comme un maximum continu. Les temps du graphe utilisent le transport en mémoire du SDK, sans réseau et sur un serveur réutilisé pour la comparaison. Ces résultats ne constituent pas une capacité garantie en requêtes par seconde, ni une mesure de navigation ou de production. Le runtime Linux devra être vérifié séparément lors d'un déploiement autorisé.

La comparaison a vérifié l'égalité complète de **664 réponses** : les graphes de 219 articles à trois limites, un article inconnu, les vues générales et deux dossiers de recherche FR/EN.

Pour reproduire le chargement, après construction du corpus :

```sh
L0G_DATA_DIR="$PWD/dist" node mcp-server/benchmark-cache.mjs
npm run test:mcp-cache
```

Un chemin optionnel vers un `server.mjs` antérieur permet de mesurer la référence avec le même corpus et ses imports associés. Le script n'ouvre aucun serveur HTTP et n'appelle pas la production.

## Vérifications exécutées

- 9 tests de cache et de graphe : concurrence, erreurs, récupération, bascule atomique, rollback, fin de lecture tardive, isolation des graphes, direction et ordre des arêtes.
- Contrats HTTP MCP complet et compact ; Agent Bench : **44/44**.
- Refus HTTP vérifiés : Host 421, Origin 403, type de contenu 415, JSON invalide 400, corps trop grand 413, quota 429 avec `Retry-After`.
- Archive locale construite et démarrée ; altération de chacun des deux nouveaux modules refusée par le vérificateur d'empreintes. Il s'agit d'un test de packaging local, pas d'une attestation de publication.
- Télémétrie MCP : 12 tests ; contrat de fraîcheur partagé : 4 tests ; distribution : 3 tests. Contrôles de politique CI et de déploiement réussis.
- `npm run check` : aucune erreur ni avertissement.
- Build Astro isolant le correctif des travaux concurrents : 1 260 pages ; Pagefind généré ; audits de sécurité et performance réussis ; 65 017 liens internes vérifiés sans destination cassée ou non canonique.

Le pipeline complet `npm run build`, qui collecte aussi des données externes et régénère toutes les publications, n'a pas été relancé. À ce stade de validation locale, aucun déploiement ni test de charge n'avait été effectué en production. Aucun test visuel supplémentaire : ce correctif ne modifie pas les composants, styles ou scripts navigateur.

## Prochaines améliorations à qualifier

| Priorité | Piste | Validation nécessaire |
| --- | --- | --- |
| 1 | Borner le nombre global de requêtes MCP coûteuses en cours, en plus du quota par IP ; mesurer mémoire et latence par catégorie sans stocker les requêtes des utilisateurs. | Charge synthétique limitée sur un environnement de test équivalent au serveur, refus temporaires explicites, récupération et absence de données périmées masquées. Ne pas augmenter le plafond mémoire pour masquer une allocation excessive. |
| 2 | Réduire le CSS commun intégré dans l'accueil : 108 067 octets de CSS pour un HTML de 197 940 octets, soit 31 864 octets gzip niveau 9. Le budget gzip local de 32 000 octets est proche. | Comparer CSS critique et feuilles partagées avec mesures de premier affichage et de stabilité visuelle, cache froid/chaud, mobile/desktop, thèmes et FR/EN. L'inlining actuel est intentionnel : retirer tout le CSS critique sans ces mesures serait une régression possible. |
| 3 | Rendre la chaîne de génération plus lisible et éviter de recalculer les images OG inchangées. | Cache basé sur le contenu, le générateur, les polices et la configuration ; comparaison des fichiers générés. Conserver tous les contrôles de sécurité et les empreintes. Le second build Astro de publication intègre une nouvelle frame Black Box immuable : il ne peut pas être supprimé comme un simple doublon. |

Les données financières, la provenance et les historiques continuent à privilégier un état indisponible explicite. Aucun gain de cache proposé ne doit modifier cette règle.
