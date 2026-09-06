import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evidenceGraphIndex } from './evidence-graph-index.mjs';

const graph = Object.freeze({
  nodes: Object.freeze(['article', 'claim', 'reference', 'host', '__proto__'].map((id) => Object.freeze({ id }))),
  edges: Object.freeze([
    { id: '1', type: 'contains', from: 'article', to: 'claim' },
    { id: '2', type: 'cites', from: 'claim', to: 'reference' },
    { id: '3', type: 'hostedBy', from: 'reference', to: 'host' },
    { id: '4', type: 'cites', from: 'claim', to: 'reference' },
    { id: '5', type: '__proto__', from: '__proto__', to: 'claim' },
  ].map(Object.freeze)),
});

test('indexed traversal preserves direction, type, identity, duplicates and source order', () => {
  const index = evidenceGraphIndex(graph);
  for (const id of [...graph.nodes.map((node) => node.id), 'missing']) {
    assert.equal(index.node(id), graph.nodes.find((node) => node.id === id));
    for (const type of ['contains', 'cites', 'hostedBy', '__proto__', 'missing']) {
      for (const direction of ['from', 'to']) {
        const expected = graph.edges.filter((edge) => edge[direction] === id && edge.type === type);
        assert.deepEqual(index[direction](id, type), expected);
        expected.forEach((edge, position) => assert.equal(index[direction](id, type)[position], edge));
      }
    }
  }
});

test('the index belongs to a corpus object and cannot cross releases', () => {
  const index = evidenceGraphIndex(graph);
  assert.equal(evidenceGraphIndex(graph), index);
  const next = { nodes: [{ id: 'article', title: 'updated' }], edges: [] };
  assert.notEqual(evidenceGraphIndex(next), index);
  assert.equal(evidenceGraphIndex(next).node('article').title, 'updated');
  assert.equal(index.node('article').title, undefined);
  assert.throws(() => index.from('claim', 'cites').pop(), TypeError);
  assert.throws(() => index.from('missing', 'cites').push({}), TypeError);
});

test('empty graphs have no nodes or edges', () => {
  const index = evidenceGraphIndex({});
  assert.equal(index.node('missing'), undefined);
  assert.deepEqual(index.to('missing', 'contains'), []);
});
