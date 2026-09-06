// Les objets du corpus sont immuables. WeakMap libère l'index quand les dernières
// requêtes utilisant une ancienne release sont terminées.
const indexes = new WeakMap();
const empty = Object.freeze([]);

export function evidenceGraphIndex(graph) {
  if (indexes.has(graph)) return indexes.get(graph);
  const nodes = new Map((graph.nodes || []).map((node) => [node.id, node]));
  const outgoing = new Map();
  const incoming = new Map();

  function append(index, id, edge) {
    let types = index.get(id);
    if (!types) index.set(id, types = new Map());
    let edges = types.get(edge.type);
    if (!edges) types.set(edge.type, edges = []);
    edges.push(edge);
  }
  for (const edge of graph.edges || []) {
    append(outgoing, edge.from, edge);
    append(incoming, edge.to, edge);
  }
  for (const index of [outgoing, incoming]) {
    for (const types of index.values()) {
      for (const edges of types.values()) Object.freeze(edges);
    }
  }
  const index = Object.freeze({
    node: (id) => nodes.get(id),
    from: (id, type) => outgoing.get(id)?.get(type) || empty,
    to: (id, type) => incoming.get(id)?.get(type) || empty,
  });
  indexes.set(graph, index);
  return index;
}
