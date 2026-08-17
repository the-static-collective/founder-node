import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTHORITY_INVARIANTS_URL,
  AUTHORITY_PROJECTS_URL,
  clearAuthorityRegistryCache,
  loadAuthorityRegistryBundle,
  loadCollectiveRepositories
} from '../src/data/authorityKitRegistry';
import { invariantDocument, invariants, projectDocument, projects } from './fixtures/authorityRegistry';

const response = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => structuredClone(body)
}) as Response;

const installFetch = (projectsDoc: unknown = projectDocument, invariantsDoc: unknown = invariantDocument) => {
  const calls: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);
    if (url === AUTHORITY_PROJECTS_URL) return response(projectsDoc);
    if (url === AUTHORITY_INVARIANTS_URL) return response(invariantsDoc);
    throw new Error(`unexpected fetch ${url}`);
  }) as typeof fetch;
  return calls;
};

test.beforeEach(() => clearAuthorityRegistryCache());

test('loads one complete observed registry bundle and preserves compatibility', async () => {
  installFetch();
  const bundle = await loadAuthorityRegistryBundle(true);
  assert.equal(bundle.repositories.length, projects.length);
  assert.equal(bundle.invariants.length, invariants.length);
  assert.equal(bundle.witness.projects.updated, '2026-08-09');
  assert.equal(bundle.witness.invariants.updated, '2026-08-07');
  assert.equal((await loadCollectiveRepositories()).length, projects.length);
});

test('project-only compatibility loader does not require the invariant registry', async () => {
  const calls: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);
    if (url === AUTHORITY_PROJECTS_URL) return response(projectDocument);
    throw new Error(`unexpected optional dependency fetch: ${url}`);
  }) as typeof fetch;

  const repositories = await loadCollectiveRepositories(true);
  assert.equal(repositories.length, projects.length);
  assert.deepEqual(calls, [AUTHORITY_PROJECTS_URL]);
});

test('rejects unsupported project registry version', async () => {
  installFetch({ ...projectDocument, version: 2 });
  await assert.rejects(() => loadAuthorityRegistryBundle(true), /project registry/);
});

test('rejects unsupported invariant registry version', async () => {
  installFetch(projectDocument, { ...invariantDocument, version: 2 });
  await assert.rejects(() => loadAuthorityRegistryBundle(true), /invariant registry/);
});

test('rejects duplicate project ids', async () => {
  installFetch({ ...projectDocument, projects: [...projectDocument.projects, projectDocument.projects[0]] });
  await assert.rejects(() => loadAuthorityRegistryBundle(true), /duplicate project id/);
});

test('rejects duplicate invariant ids', async () => {
  installFetch(projectDocument, { ...invariantDocument, invariants: [...invariants, invariants[0]] });
  await assert.rejects(() => loadAuthorityRegistryBundle(true), /duplicate invariant id/);
});

test('rejects invariant owner not present in projects', async () => {
  installFetch(projectDocument, { ...invariantDocument, invariants: [{ ...invariants[0], owner: 'missing' }] });
  await assert.rejects(() => loadAuthorityRegistryBundle(true), /unknown owner/);
});

test('rejects invariant consumer not present in projects', async () => {
  installFetch(projectDocument, { ...invariantDocument, invariants: [{ ...invariants[0], consumers: ['missing'] }] });
  await assert.rejects(() => loadAuthorityRegistryBundle(true), /unknown consumer/);
});

test('failed force refresh leaves previous complete bundle intact', async () => {
  installFetch();
  const first = await loadAuthorityRegistryBundle(true);
  let calls = 0;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    calls += 1;
    const url = String(input);
    if (url === AUTHORITY_PROJECTS_URL) return response({ ...projectDocument, updated: '2026-08-10' });
    if (url === AUTHORITY_INVARIANTS_URL) throw new Error('network down');
    throw new Error('unexpected fetch');
  }) as typeof fetch;
  await assert.rejects(() => loadAuthorityRegistryBundle(true), /unavailable/);
  const cached = await loadAuthorityRegistryBundle();
  assert.equal(cached.witness.projects.updated, first.witness.projects.updated);
  assert.equal(calls, 2);
});

test('clearing cache makes next load fetch both documents again', async () => {
  const calls = installFetch();
  await loadAuthorityRegistryBundle();
  assert.equal(calls.length, 2);
  clearAuthorityRegistryCache();
  await loadAuthorityRegistryBundle();
  assert.equal(calls.length, 4);
});
