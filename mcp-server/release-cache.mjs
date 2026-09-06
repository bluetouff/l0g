// Une seule copie du corpus par release, même au démarrage sous charge.
// Le chemin réel est résolu à chaque appel : aucune durée de cache ne retarde
// un déploiement ou un rollback. Une erreur reste une erreur, sans ancien corpus.
export function createReleaseCache(resolveDirectory, loadRelease) {
  let latestDirectory;
  let cached;
  const pending = new Map();

  return async function load() {
    const directory = await resolveDirectory();
    latestDirectory = directory;
    if (cached?.directory === directory) return cached.data;
    if (pending.has(directory)) return pending.get(directory);

    const request = Promise.resolve().then(() => loadRelease(directory)).then((data) => {
      // Une ancienne lecture encore en vol ne doit pas évincer la nouvelle release.
      if (latestDirectory === directory) cached = { directory, data };
      return data;
    }).finally(() => pending.delete(directory));
    pending.set(directory, request);
    return request;
  };
}
