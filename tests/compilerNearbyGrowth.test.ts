import test from 'node:test';
import assert from 'node:assert/strict';
import { compileFounderIntent } from '../src/services/compileFounderIntent';
import { AUTHORITY_INVARIANTS_URL, AUTHORITY_PROJECTS_URL, clearAuthorityRegistryCache } from '../src/data/authorityKitRegistry';
import { invariantDocument, projectDocument } from './fixtures/authorityRegistry';

const response = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => structuredClone(body)
}) as Response;

const understanding = {
  observedFacts: [], goals: [], constraints: [], unknowns: [], potentialRepositories: [],
  dependencies: [], risks: [], suggestedSlice: 'x'
};

const serverCheck = (authorityConflicts: unknown[]) => ({
  belongsTo: 'x', isNewWork: true, isAlreadySolved: false, isDuplicated: false, existingIssue: null,
  authorityConflicts, dependenciesAndBlockers: [], guidance: 'x', architecturalMemoryFlags: []
});

function install(mode: 'throw' | 'success' | 'blocked') {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url === AUTHORITY_PROJECTS_URL) return response(projectDocument);
    if (url === AUTHORITY_INVARIANTS_URL) return response(invariantDocument);
    if (url === '/api/compile-intent') {
      if (mode === 'throw') throw new Error('offline');
      const conflicts = mode === 'blocked'
        ? [{ repository: 'corpus-os', conflictReason: 'server says no', severity: 'high' }]
        : [];
      return response({ understanding, architecturalCheck: serverCheck(conflicts) });
    }
    throw new Error(`unexpected ${url}`);
  }) as typeof fetch;
}

test.beforeEach(() => clearAuthorityRegistryCache());

test('successful deterministic local fallback attaches nearby growth without replacing primary routing', async () => {
  install('throw');
  const compiled = await compileFounderIntent({
    rawText: 'work in corpus os',
    selectedTargetRepos: ['corpus-os'],
    requestedProposalTypes: ['specification']
  });
  assert.equal(compiled.architecturalCheck.routingBlocked, false);
  assert.deepEqual(compiled.nearbyGrowth?.doors.map(door => door.projectId), ['tranchnode', 'project0']);
  assert.equal(compiled.nearbyGrowth?.registryWitness.projects.updated, '2026-08-09');
  assert.deepEqual(compiled.understanding.potentialRepositories, ['corpus-os']);
});

test('deterministic historical route block emits no nearby growth or proposals', async () => {
  install('success');
  const compiled = await compileFounderIntent({
    rawText: 'work in historical donor',
    selectedTargetRepos: ['historical-donor'],
    requestedProposalTypes: ['specification']
  });
  assert.equal(compiled.architecturalCheck.routingBlocked, true);
  assert.equal(compiled.nearbyGrowth, undefined);
  assert.equal(compiled.proposals.length, 0);
});

test('server high-severity semantic block emits no nearby growth or proposals', async () => {
  install('blocked');
  const compiled = await compileFounderIntent({
    rawText: 'work in corpus os',
    selectedTargetRepos: ['corpus-os'],
    requestedProposalTypes: ['specification']
  });
  assert.equal(compiled.architecturalCheck.routingBlocked, true);
  assert.equal(compiled.nearbyGrowth, undefined);
  assert.equal(compiled.proposals.length, 0);
});

test('server understanding cannot substitute a different nearby target', async () => {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url === AUTHORITY_PROJECTS_URL) return response(projectDocument);
    if (url === AUTHORITY_INVARIANTS_URL) return response(invariantDocument);
    if (url === '/api/compile-intent') return response({
      understanding: { ...understanding, potentialRepositories: ['haunted-toaster'] },
      architecturalCheck: serverCheck([])
    });
    throw new Error(`unexpected ${url}`);
  }) as typeof fetch;

  const compiled = await compileFounderIntent({
    rawText: 'work in corpus os and mention haunted toaster',
    selectedTargetRepos: ['corpus-os'],
    requestedProposalTypes: ['specification']
  });

  assert.deepEqual(compiled.understanding.potentialRepositories, ['corpus-os']);
  assert.deepEqual(compiled.nearbyGrowth?.doors.map(door => door.projectId), ['tranchnode', 'project0']);
  assert.ok(!compiled.nearbyGrowth?.doors.some(door => door.projectId === 'haunted-toaster'));
});
