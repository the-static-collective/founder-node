import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveNearbyGrowth } from '../src/services/nearbyGrowth';
import type { AuthorityInvariantRecord, NearbyGrowthInput } from '../src/types/nearbyGrowth';
import { invariants, makeRepository, projects, witness } from './fixtures/authorityRegistry';

const inputFor = (routedProjectIds: string[], overrides: Partial<NearbyGrowthInput> = {}): NearbyGrowthInput => ({
  routedProjectIds,
  projects,
  invariants,
  registryWitness: witness,
  ...overrides
});

test('Corpus OS exposes TranchNode then Project0 with both evidence classes on TranchNode', () => {
  const corpus = deriveNearbyGrowth(inputFor(['corpus-os']));
  assert.deepEqual(corpus.doors.map(door => door.projectId), ['tranchnode', 'project0']);
  assert.deepEqual(corpus.doors[0].evidence.map(item => item.kind), ['typed-relation', 'shared-invariant']);
  assert.equal(corpus.doors[0].evidence[0].kind, 'typed-relation');
  if (corpus.doors[0].evidence[0].kind === 'typed-relation') {
    assert.equal(corpus.doors[0].evidence[0].relationType, 'DEPENDS_ON');
  }
});

test('Toaster Lab exposes Haunted Toaster through PROPOSES_TO', () => {
  const result = deriveNearbyGrowth(inputFor(['toaster-lab']));
  assert.equal(result.doors[0]?.projectId, 'haunted-toaster');
  assert.ok(result.doors[0]?.evidence.some(item => item.kind === 'typed-relation' && item.relationType === 'PROPOSES_TO'));
});

test('Groove Rooms exposes Band Runtime through EMBODIES', () => {
  const result = deriveNearbyGrowth(inputFor(['groove-rooms']));
  assert.equal(result.doors[0]?.projectId, 'band-runtime');
  assert.ok(result.doors[0]?.evidence.some(item => item.kind === 'typed-relation' && item.relationType === 'EMBODIES'));
});

test('Jubilee Authority Kit sees TranchNOSE through invariant only, and removal removes the door', () => {
  const cleanProjects = projects.map(project =>
    project.id === 'dormant-donor' || project.id === 'historical-donor' ? { ...project, relations: [] } : project
  );
  const result = deriveNearbyGrowth(inputFor(['jubilee-authority-kit'], { projects: cleanProjects }));
  assert.equal(result.doors[0]?.projectId, 'tranchnose');
  assert.deepEqual(result.doors[0]?.evidence.map(item => item.kind), ['shared-invariant']);
  const withoutReplay = invariants.filter(item => item.id !== 'replay-from-recorded-state');
  assert.deepEqual(deriveNearbyGrowth(inputFor(['jubilee-authority-kit'], { projects: cleanProjects, invariants: withoutReplay })).doors, []);
});

test('role and description text cannot admit an unrelated door', () => {
  const tempting = makeRepository('tempting-creative');
  tempting.role = 'corpus navigation tranchnode project0';
  tempting.description = 'looks extremely related to corpus os';
  const result = deriveNearbyGrowth(inputFor(['corpus-os'], { projects: [...projects, tempting] }));
  assert.ok(!result.doors.some(door => door.projectId === 'tempting-creative'));
});

test('output is invariant under project, relation, invariant, consumer, and proof-ref ordering', () => {
  const shuffledProjects = [...projects].reverse().map(project => ({ ...project, relations: [...project.relations].reverse() }));
  const shuffledInvariants = [...invariants].reverse().map(invariant => ({
    ...invariant,
    consumers: [...invariant.consumers].reverse(),
    proofRefs: [...invariant.proofRefs].reverse()
  }));
  const normal = deriveNearbyGrowth(inputFor(['corpus-os']));
  const shuffled = deriveNearbyGrowth(inputFor(['corpus-os'], { projects: shuffledProjects, invariants: shuffledInvariants }));
  assert.deepEqual(shuffled, normal);
});

test('result is bounded to three doors with deterministic id tie-break', () => {
  const route = makeRepository('route', [
    { type: 'DEPENDS_ON', target: 'd' },
    { type: 'DEPENDS_ON', target: 'b' },
    { type: 'DEPENDS_ON', target: 'c' },
    { type: 'DEPENDS_ON', target: 'a' }
  ]);
  const extra = [route, ...['a', 'b', 'c', 'd'].map(id => makeRepository(id))];
  const result = deriveNearbyGrowth(inputFor(['route'], { projects: extra, invariants: [] }));
  assert.deepEqual(result.doors.map(door => door.projectId), ['a', 'b', 'c']);
});

test('monument, ancestor, and lineage-ancestor candidates are excluded', () => {
  const route = makeRepository('route', [
    { type: 'DONATES_PATTERN_TO', target: 'monument' },
    { type: 'DONATES_PATTERN_TO', target: 'ancestor' },
    { type: 'DONATES_PATTERN_TO', target: 'lineage' }
  ]);
  const candidates = [
    makeRepository('monument', [], 'monument', 'concept-donor'),
    makeRepository('ancestor', [], 'ancestor', 'concept-donor'),
    makeRepository('lineage', [], 'active', 'lineage-ancestor')
  ];
  assert.deepEqual(deriveNearbyGrowth(inputFor(['route'], { projects: [route, ...candidates], invariants: [] })).doors, []);
});

test('dormant explicitly evidenced candidate is retained with dormant status', () => {
  const cleanInvariants = invariants.filter(item => item.id !== 'replay-from-recorded-state');
  const result = deriveNearbyGrowth(inputFor(['jubilee-authority-kit'], { invariants: cleanInvariants }));
  assert.equal(result.doors.find(door => door.projectId === 'dormant-donor')?.status, 'dormant');
});

test('unknown relation target is diagnosed and never synthesized', () => {
  const route = makeRepository('route', [{ type: 'DEPENDS_ON', target: 'missing' }]);
  const result = deriveNearbyGrowth(inputFor(['route'], { projects: [route], invariants: [] }));
  assert.deepEqual(result.doors, []);
  assert.deepEqual(result.diagnostics, ['unknown relation target: route -> missing']);
});

test('unknown invariant participant is diagnosed and never synthesized', () => {
  const route = makeRepository('route');
  const broken: AuthorityInvariantRecord = {
    id: 'broken', claim: 'ignored', owner: 'route', proof: 'ignored', formalRule: 'ignored', proofRefs: [],
    consumers: ['missing'], counterexamples: ['x'], maturity: 'proven'
  };
  const result = deriveNearbyGrowth(inputFor(['route'], { projects: [route], invariants: [broken] }));
  assert.deepEqual(result.doors, []);
  assert.deepEqual(result.diagnostics, ['unknown invariant participant: broken -> missing']);
});

test('non-proven invariant does not admit a door', () => {
  const route = makeRepository('route');
  const candidate = makeRepository('candidate');
  const proposed: AuthorityInvariantRecord = {
    id: 'proposal', claim: 'ignored', owner: 'route', proof: 'ignored', formalRule: 'ignored', proofRefs: [],
    consumers: ['candidate'], counterexamples: ['x'], maturity: 'operational'
  };
  assert.deepEqual(deriveNearbyGrowth(inputFor(['route'], { projects: [route, candidate], invariants: [proposed] })).doors, []);
});

test('no evidence and unknown routed project are legitimate non-authoritative outcomes', () => {
  const solo = makeRepository('solo');
  assert.deepEqual(deriveNearbyGrowth(inputFor(['solo'], { projects: [solo], invariants: [] })).doors, []);
  assert.deepEqual(deriveNearbyGrowth(inputFor(['missing'], { projects: [solo], invariants: [] })).diagnostics, ['unknown routed project: missing']);
});
