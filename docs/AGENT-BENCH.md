# l0g Agent Bench

État documenté : `2026-07-17`. Jeu de cas : `1.0.0`. Agent Surface : `1.13.0`.
Le dépôt, la release attestée `mcp-v1.20.0`, le Registry et le MCP public sont
alignés sur `1.20.0`.

Le benchmark exécute 44 cas déterministes, en français et en anglais, contre le serveur MCP réellement construit. Il n’appelle aucun LLM et ne mesure aucun temps d’exécution.

Il couvre : document canonique attendu dans le top 3, parité FR/EN, présence d’une source primaire attendue, comportement `asOf`, refus d’une recherche insuffisamment étayée, fraîcheur et séparation entre observation, estimation, inférence et scénario.

Les cas versionnés sont dans `mcp-server/agent-bench-cases.json`. Le runner est `mcp-server/agent-bench.mjs`. En CI, le résultat remplace le placeholder Astro dans `dist/api/v1/agent-bench.json`, puis cet artefact est attesté avec les autres surfaces publiques.

Un échec rend la commande non nulle et bloque la publication. Le rapport contient le hash SHA-256 exact du jeu de cas, les versions Agent Surface et MCP, le SHA Git de CI, les scores par capacité et chaque observation déterministe.
