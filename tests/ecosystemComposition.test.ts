import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveNearbyGrowth } from '../src/services/nearbyGrowth';
import {
  appendFounderIntentWitness, createWorkbenchInspectionHandoff,
  deriveEcosystemComposition, makeFounderIntentWitness
} from '../src/services/ecosystemComposition';
import type { CompiledIdea } from '../src/types/founderNode';
import { makeRepository, projects, invariants, witness } from './fixtures/authorityRegistry';

const make = (routedProjectIds: string[], projectSet = projects, invariantSet = invariants) => {
  const nearbyGrowth = deriveNearbyGrowth({
    routedProjectIds, projects: projectSet, invariants: invariantSet, registryWitness: witness
  });
  return deriveEcosystemComposition({
    routedProjectIds, projects: projectSet, invariants: invariantSet, nearbyGrowth, registryWitness: witness
  });
};

test('map retains separately typed relation and proven invariant edges without claiming runtime links', () => {
  const result = make(['corpus-os']);
  assert.ok(result.edges.some(e => e.from === 'corpus-os' && e.to === 'tranchnode' &&
    e.kind === 'declared-relation' && e.reference === 'DEPENDS_ON'));
  assert.ok(result.edges.some(e => e.from === 'tranchnode' && e.to === 'corpus-os' &&
    e.kind === 'proven-invariant' && e.reference === 'immutable-source'));
  assert.ok(result.draft);
  assert.deepEqual(result.draft.participants.map(p => p.projectId), ['corpus-os', 'tranchnode', 'project0']);
  assert.equal(result.draft.state, 'proposal-only');
  assert.equal(result.draft.registryWitness.projects.updated, '2026-08-09');
});

test('draft is deterministic across registry orderings; unproven invariants cannot add a door', () => {
  const original = make(['corpus-os']);
  const shuffled = make(['corpus-os'], [...projects].reverse().map(p => ({ ...p, relations: [...p.relations].reverse() })),
    [...invariants].reverse().map(i => ({ ...i, consumers: [...i.consumers].reverse() })));
  assert.deepEqual(shuffled, original);

  const route = makeRepository('route');
  const neighboring = makeRepository('neighbor');
  const unproven = [{
    id: 'wish', claim: 'wish', owner: 'route', proof: 'wish', formalRule: 'wish',
    proofRefs: [], consumers: ['neighbor'], counterexamples: [], maturity: 'proposed'
  }];
  const unprovenMap = make(['route'], [route, neighboring], unproven);
  assert.equal(unprovenMap.draft, null);
  assert.deepEqual(unprovenMap.edges, []);
});

test('unrelated, missing, dormant and historical projects do not become composition participants', () => {
  const route = makeRepository('route', [
    { type: 'DEPENDS_ON', target: 'live' },
    { type: 'DEPENDS_ON', target: 'sleeping' },
    { type: 'DEPENDS_ON', target: 'past' },
    { type: 'DEPENDS_ON', target: 'missing' }
  ]);
  const live = makeRepository('live');
  const sleeping = makeRepository('sleeping', [], 'dormant');
  const past = makeRepository('past', [], 'monument');
  const unrelated = makeRepository('unrelated');
  unrelated.role = 'extremely relevant to the composition';
  const result = make(['route'], [route, live, sleeping, past, unrelated]);
  assert.deepEqual(result.draft?.participants.map(p => p.projectId), ['route', 'live']);
  assert.ok(result.diagnostics.includes('unknown relation target: route -> missing'));
});

test('handoff only describes inspection; it never conveys an execution instruction or admission', () => {
  const draft = make(['corpus-os']).draft!;
  const handoff = createWorkbenchInspectionHandoff(draft);
  assert.equal(handoff.mode, 'descriptor-only');
  assert.equal(handoff.executionAuthorized, false);
  assert.equal(handoff.destinationAcceptance, 'not-requested');
  assert.equal(handoff.localReadiness, 'unknown');
  assert.equal(handoff.compatibility, 'unverified');
  assert.deepEqual(handoff.proposedParticipants.map(p => p.projectId), ['corpus-os', 'tranchnode', 'project0']);
  assert.ok(!('command' in handoff));
  assert.ok(!('endpoint' in handoff));
});

test('human-selected intent witness preserves raw words, separates interpretation and refuses overwrite', () => {
  const compiled = {
    id: 'compile-1',
    rawText: 'I want the workbench to compose, not govern.',
    understanding: { goals: ['try local composition'], potentialRepositories: ['founder-node'] },
    architecturalCheck: { routingBlocked: false }
  } as CompiledIdea;
  const first = makeFounderIntentWitness(compiled, 'observation-1', '2026-09-19T00:00:00Z');
  const history = appendFounderIntentWitness([], first);
  assert.equal(history[0].rawIntent, compiled.rawText);
  assert.deepEqual(history[0].interpretation, ['try local composition']);
  assert.equal(history[0].routingDisposition, 'proposed');
  assert.throws(() => appendFounderIntentWitness(history, first), /already recorded/);
  assert.equal(history.length, 1);
  const later = makeFounderIntentWitness({ ...compiled, id: 'compile-2', rawText: 'On reconsideration, keep it smaller.' },
    'observation-2', '2026-09-19T01:00:00Z');
  assert.equal(appendFounderIntentWitness(history, later).length, 2);
  assert.equal(history[0].rawIntent, compiled.rawText);
});

test('no evidenced neighbor means no handoffable draft', () => {
  const result = make(['unknown'], [makeRepository('solo')], []);
  assert.equal(result.draft, null);
  assert.deepEqual(result.nodes.map(n => n.projectId), ['solo']);
});
