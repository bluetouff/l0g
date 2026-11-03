# Transport de la release statique par GitHub Releases

Le transfert des quelque 248 Mo d'archive par `git push` est remplacé par un upload
d'assets GitHub Releases. Git conserve uniquement `source.env`, le checksum,
le bundle d'attestation et `transport.env`. Il ne transporte plus l'archive ni ses
fragments. La taille effectivement envoyée à Git est journalisée par le publisher.

## Séquence et sécurité

Le job de publication reste conditionné au build complet et à la suite SVG. Il
revérifie la release transférée, atteste l'archive et les manifestes, puis publie
les assets sous `static-<SHA complet>-<run>-<tentative du build>`.

Une reprise ne remplace jamais un asset existant. Les empreintes des assets déjà
présents doivent correspondre ; un bundle existant est retéléchargé et vérifié
avec le workflow, la ref, le SHA et le refus des runners auto-hébergés. Une erreur
réseau ou un refus d'accès ne sont pas assimilés à une release absente. Les drafts
interrompus sont repris par leur tag en utilisant la résolution officielle de `gh`.

Les releases statiques sont des préreleases, jamais marquées `Latest`. Elles
n'interfèrent pas avec le poller des versions MCP. Le statut prérelease sert à
séparer les canaux de distribution ; les contrôles de production restent complets.

Le serveur n'accepte aucune URL dans le manifeste Git. Il construit une URL HTTPS
GitHub canonique depuis les coordonnées contrôlées, télécharge avec bornes de
durée et de taille, vérifie SHA-256 et Sigstore avant même de lister l'archive,
puis applique les protections d'extraction et le contrôle des coordonnées internes.
Les références distantes sont relues avant la bascule atomique. Un échec conserve
le symlink courant et les marqueurs. Aucun token permanent ni nouvelle permission
n'est ajouté au serveur ; les permissions du job CI restent inchangées.

## Activation en deux temps

1. Installer le worker compatible depuis les fichiers relus et testés, avec
   `sudo deploy/activate-worker.sh`. Ce script conserve une sauvegarde datée,
   installe atomiquement, vérifie le service et restaure worker, unités, symlink
   et marqueurs si la vérification échoue. Le worker accepte toujours les formats
   historiques, ce qui permet cette installation avant la bascule du workflow.
2. Vérifier le SHA-256 installé et le timer, puis fusionner la migration CI.
3. Contrôler la première release statique : digests des assets, quatre fichiers
   seulement dans `built`, succès du pipeline et révision effectivement servie.

Ne pas fusionner la bascule CI tant que le worker compatible n'est pas installé.
Si `sudo -n` refuse l'installation, l'administrateur exécute la commande dans son
terminal ; aucun mot de passe ne doit être transmis à l'assistant.

## Validation

`npm run test:ci-policy` teste notamment la fermeture des dépendances du checkout
minimal du publisher. `npm run test:deploy` couvre les trois transports, la
préservation de la release courante et les refus de téléchargement absent, vide,
trop grand, altéré ou ambigu, de marqueur malformé et de signature incorrecte.
Les tests du publisher couvrent publication, reprise de draft, idempotence,
coordonnées étrangères, erreurs réseau et refus d'accès, digests et attestations.

Les assets et leurs tags ne sont pas purgés par cette migration. La rétention des
répertoires activés sur le serveur et le rollback existant sont conservés.
