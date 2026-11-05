# Lecture et bibliothèque locales

Les articles lus, les graphiques favoris et la préférence de lecture immersive restent dans le navigateur. Aucun compte, cookie de suivi ou envoi distant ne les accompagne. La suppression des données du navigateur les efface. Les positions de lecture et la liste « À lire » conservent leurs clés et règles existantes.

Le nouveau stockage `l0g-reader-workspace-v1` conserve uniquement des chemins d’analyses FR/EN, des titres bornés, un horodatage et, pour les graphiques, l’ancre existante créée par ArticleTools. Il contient au plus 100 articles lus, 30 graphiques et 32 768 caractères. Les entrées les plus anciennes sortent en premier lorsque la taille est atteinte. Le statut « lu » résulte d’une action explicite.

L’avancement d’un livre reprend exclusivement l’ordre des chapitres de son JSON-LD `Book.hasPart`. Sans liste valide, le bloc reste masqué. Les deux versions linguistiques d’une analyse ont des statuts distincts.

La vue Couvertures réutilise les composants, images, liens et six éditions par page du catalogue. Le filtre thématique peut parcourir toutes les éditions ; sa réinitialisation restaure la page courante et sa pagination. Les sujets explicites sont dans `src/config/publication-topics.ts`.

La recherche express charge son interface puis l’index Pagefind à la demande, avec la même option `noWorker` que la recherche complète. Les résultats utilisent des nœuds texte et des liens de même origine. La recherche complète reste accessible si le chargement échoue.

## Notes de révision

Pour une modification éditoriale substantielle, renseigner `updatedDate` et `revisionNote` dans le frontmatter FR et EN concernés. La note est un texte de 1 à 320 caractères décrivant précisément la modification effectuée. Elle apparaît près de la date de l’article et dans les cartes du flux. Ne pas déduire une note d’une date ni modifier artificiellement une date pour rendre un article récent. Les anciennes révisions peuvent être documentées seulement après vérification de leur diff Git.

Exécuter `npm run test:reader-experience`, `npm run test:search`, `npm run check` et `npm run publish:check`, puis vérifier le rendu et les interactions FR/EN à largeur mobile. Les budgets supplémentaires sont dans `scripts/audit-reader-workspace-budget.mjs` ; le budget des outils existants et les contrôles de sécurité restent inchangés.
