# Pollen Scout / Evidenced Nearby Growth v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an advisory, deterministic Founder Node projection that shows at most three neighboring project doors only when Authority Kit machine-readable evidence explicitly supports them, while preserving existing routing authority and visible registry provenance.

**Architecture:** Extend the existing Authority Kit loader into one cached observed bundle containing `projects.json`, `invariants.json`, and independent witness metadata. Run a new pure `deriveNearbyGrowth(...)` projection only after ordinary Founder Node routing remains unblocked, attach the advisory result to successful compilations, and render it in a small non-dispatching UI panel whose evidence chips explain every suggestion.

**Tech Stack:** TypeScript 5.8, React 19, Vite 6, `tsx`, Node 22 built-in `node:test`, `react-dom/server` for dependency-free component rendering tests.

## Global Constraints

- Governing law: **Show only the neighboring doors the recorded ecosystem can explain. Never confuse relevance with authority, and never cross a door automatically.**
- Nearby Growth consumes only Authority Kit `projects.json` and `invariants.json`; no GitHub/GitBook runtime crawling.
- No embeddings, semantic similarity, LLM relevance scoring, taxonomy-only proximity, or free-text `owns` / `nonAuthority` interpretation inside the projection.
- The project and invariant registry reads are an **observed registry pair**, not an atomic Git commit snapshot; never invent a commit SHA.
- Existing `loadCollectiveRepositories(force?)` remains source-compatible for current callers.
- A forced registry reload replaces the whole cached bundle only after both fresh documents validate successfully.
- If either required registry is unavailable or globally malformed, fail closed; never combine a fresh half with a stale cached half.
- Only `maturity: "proven"` invariants admit Nearby Growth in v0.1.
- Nearby Growth runs only after existing routing is unblocked. A server-returned high-severity authority conflict also suppresses Nearby Growth.
- Historical `ancestor`, `monument`, and `lineage-ancestor` candidates are excluded. `dormant` candidates may appear when explicit evidence supports them and must retain their lifecycle status.
- Return at most three doors, deterministically ordered according to the approved spec.
- A shown door grants no authority, queues nothing, dispatches nothing, creates no issue/PR, and mutates no repository.
- Selecting a door must re-enter the ordinary Founder Node compile/routing path before any proposal is emitted.
- `PollenReceipt` remains deferred.
- Freshness decision recorded 2026-08-16: no Jubilee Authority Kit mutation is currently required. The acceptance edges `corpus-os -> tranchnode`, `corpus-os -> project0`, `toaster-lab -> haunted-toaster`, and `groove-rooms -> band-runtime` are explicit in current `projects.json`; the required proven invariant specimens already exist in `invariants.json`. Re-check these exact load-bearing facts before final PR review; if one changed materially, stop and reconcile Authority Kit separately rather than widening this Founder Node branch.
- Do not fix the repository's pre-existing missing `tsconfig.json` / `index.html` harness problem as part of this slice. Use the independent `tsx --test` proof floor added below.

---

## File Structure

### Create

- `src/types/nearbyGrowth.ts` — Authority Kit invariant/witness/bundle types plus Nearby Growth input/output evidence contracts.
- `src/services/nearbyGrowth.ts` — pure deterministic projection; no network, prompt, storage, or UI dependencies.
- `src/components/NearbyGrowthPanel.tsx` — small advisory UI surface that renders doors, evidence reasons, lifecycle status, and observed registry dates.
- `tests/fixtures/authorityRegistry.ts` — focused frozen registry fixtures used by loader/projection/compiler/UI tests.
- `tests/authorityKitRegistry.test.ts` — bundle-loader compatibility, validation, atomic cache replacement, and force-reload tests.
- `tests/nearbyGrowth.test.ts` — projection acceptance specimens, ordering, malformed-edge diagnostics, and negative controls.
- `tests/compilerNearbyGrowth.test.ts` — successful-routing and blocked-routing integration tests.
- `tests/NearbyGrowthPanel.test.tsx` — dependency-free static-render assertions for evidence, zero-state, and provenance copy.

### Modify

- `package.json` — add a test script using the existing `tsx` dev dependency; no new package dependency.
- `src/data/authorityKitRegistry.ts` — add invariant URL, rich bundle loader, validation, witness metadata, and whole-bundle cache while keeping `loadCollectiveRepositories()`.
- `src/types/founderNode.ts` — allow successful `CompiledIdea` values to carry optional advisory `nearbyGrowth` without changing existing required fields.
- `src/services/compilerEngine.ts` — load the bundle once, preserve existing routing, derive Nearby Growth only after all authority gates pass, and attach the advisory result.
- `src/App.tsx` — render `NearbyGrowthPanel` after a successful compilation and route an explicit human door selection back through `handleCompile(...)` using the selected project id.

No Jubilee Authority Kit file is modified by this plan unless the explicit final freshness re-check proves one of the acceptance facts stale.

---

### Task 1: Establish the independent test floor and Authority Kit observed-bundle loader

**Files:**
- Create: `src/types/nearbyGrowth.ts`
- Create: `tests/fixtures/authorityRegistry.ts`
- Create: `tests/authorityKitRegistry.test.ts`
- Modify: `package.json`
- Modify: `src/data/authorityKitRegistry.ts`

**Interfaces:**
- Consumes: existing `RepositoryContext`, `RepositoryStatus`, and existing `loadCollectiveRepositories(force?)` callers.
- Produces:
  - `AuthorityProofRef`
  - `AuthorityInvariantRecord`
  - `AuthorityRegistryWitness`
  - `AuthorityRegistryBundle`
  - `loadAuthorityRegistryBundle(force?: boolean): Promise<AuthorityRegistryBundle>`
  - unchanged `loadCollectiveRepositories(force?: boolean): Promise<RepositoryContext[]>`
  - unchanged `clearAuthorityRegistryCache(): void`

- [ ] **Step 1: Add the repository-independent Node test command**

Replace the `scripts` section in `package.json` with the same existing scripts plus:

```json
"test": "tsx --test"
```

Do not add Vitest, Jest, Testing Library, jsdom, or any other dependency.

- [ ] **Step 2: Create the shared Nearby Growth / Authority Kit types**

Create `src/types/nearbyGrowth.ts`:

```ts
import type { RepositoryContext, RepositoryStatus } from './founderNode';

export interface AuthorityProofRef {
  repository: string;
  type: string;
  number?: number;
  commit?: string;
}

export interface AuthorityInvariantRecord {
  id: string;
  claim: string;
  owner: string;
  proof: string;
  formalRule: string;
  proofRefs: AuthorityProofRef[];
  consumers: string[];
  counterexamples: string[];
  maturity: string;
}

export interface AuthorityRegistryWitnessEntry {
  version: number;
  updated: string;
  source: string;
}

export interface AuthorityRegistryWitness {
  projects: AuthorityRegistryWitnessEntry;
  invariants: AuthorityRegistryWitnessEntry;
}

export interface AuthorityRegistryBundle {
  repositories: RepositoryContext[];
  invariants: AuthorityInvariantRecord[];
  witness: AuthorityRegistryWitness;
}

export type NearbyGrowthEvidence =
  | {
      kind: 'typed-relation';
      relationType: string;
      direction: 'outbound' | 'inbound';
      sourceProjectId: string;
      targetProjectId: string;
    }
  | {
      kind: 'shared-invariant';
      invariantId: string;
      ownerProjectId: string;
      proofRefs: AuthorityProofRef[];
    };

export interface NearbyGrowthDoor {
  projectId: string;
  repository: string;
  role: string;
  status: RepositoryStatus;
  evidence: NearbyGrowthEvidence[];
}

export interface NearbyGrowthInput {
  routedProjectIds: string[];
  projects: RepositoryContext[];
  invariants: AuthorityInvariantRecord[];
  registryWitness: AuthorityRegistryWitness;
}

export interface NearbyGrowthResult {
  doors: NearbyGrowthDoor[];
  registryWitness: AuthorityRegistryWitness;
  diagnostics: string[];
}
```

- [ ] **Step 3: Add focused frozen test fixtures**

Create `tests/fixtures/authorityRegistry.ts` with a `makeRepository(...)` helper that fills the UI-only `RepositoryContext` fields with stable empty values, plus these exact projects:

```ts
export const projects = [
  makeRepository('project0', [], 'active', 'constitutional-substrate'),
  makeRepository('tranchnode', [{ type: 'CONFORMS_TO', target: 'project0' }], 'active', 'constitutional-substrate'),
  makeRepository('haunted-toaster', [], 'active', 'domain-kernel'),
  makeRepository('band-runtime', [], 'active', 'domain-kernel'),
  makeRepository('toaster-lab', [{ type: 'PROPOSES_TO', target: 'haunted-toaster' }], 'active', 'proposal-discovery'),
  makeRepository('corpus-os', [
    { type: 'DEPENDS_ON', target: 'tranchnode' },
    { type: 'CONFORMS_TO', target: 'project0' }
  ], 'active', 'embodiment'),
  makeRepository('groove-rooms', [{ type: 'EMBODIES', target: 'band-runtime' }], 'active', 'embodiment'),
  makeRepository('jubilee-authority-kit', [], 'seed', 'shared-protocol'),
  makeRepository('tranchnose', [], 'active', 'research-kernel'),
  makeRepository('historical-donor', [{ type: 'DONATES_PATTERN_TO', target: 'jubilee-authority-kit' }], 'monument', 'concept-donor'),
  makeRepository('dormant-donor', [{ type: 'DONATES_PATTERN_TO', target: 'jubilee-authority-kit' }], 'dormant', 'concept-donor')
];
```

Include proven fixture invariants for:

```ts
immutable-source: owner='tranchnode', consumers=['corpus-os']
proposal-not-authority: owner='toaster-lab', consumers=['haunted-toaster']
refusal-preserves-state: owner='band-runtime', consumers=['groove-rooms']
replay-from-recorded-state: owner='tranchnose', consumers=['jubilee-authority-kit']
```

Use witness dates `projects.updated = '2026-08-09'` and `invariants.updated = '2026-08-07'`.

- [ ] **Step 4: Write failing loader tests before changing the loader**

Create `tests/authorityKitRegistry.test.ts` using `node:test` and `node:assert/strict`.

Mock `globalThis.fetch` with a deterministic two-document responder and assert:

```ts
const bundle = await loadAuthorityRegistryBundle(true);
assert.equal(bundle.repositories.length, projects.length);
assert.equal(bundle.invariants.length, invariants.length);
assert.equal(bundle.witness.projects.updated, '2026-08-09');
assert.equal(bundle.witness.invariants.updated, '2026-08-07');
assert.equal((await loadCollectiveRepositories()).length, projects.length);
```

Add independent tests proving:

1. unsupported project registry `version !== 1` rejects;
2. unsupported invariant registry `version !== 1` rejects;
3. duplicate project ids reject;
4. duplicate invariant ids reject;
5. invariant owner not present in projects rejects;
6. invariant consumer not present in projects rejects;
7. `force=true` does not replace the previous cache when the second fresh document fails — after the failed force call, a normal non-force call must still return the previous complete bundle;
8. `clearAuthorityRegistryCache()` forces the next read to fetch both documents again.

- [ ] **Step 5: Run the tests and verify the new interface is missing**

Run:

```bash
npm test -- tests/authorityKitRegistry.test.ts
```

Expected: FAIL because `loadAuthorityRegistryBundle` and the invariant URL/bundle behavior do not exist yet.

- [ ] **Step 6: Implement the minimal whole-bundle loader**

Refactor `src/data/authorityKitRegistry.ts` so it exports:

```ts
export const AUTHORITY_PROJECTS_URL =
  'https://raw.githubusercontent.com/the-static-collective/jubilee-authority-kit/main/registry/projects.json';

export const AUTHORITY_INVARIANTS_URL =
  'https://raw.githubusercontent.com/the-static-collective/jubilee-authority-kit/main/registry/invariants.json';
```

Keep `AUTHORITY_REGISTRY_URL` as a compatibility alias if any current source imports it:

```ts
export const AUTHORITY_REGISTRY_URL = AUTHORITY_PROJECTS_URL;
```

Use one cache:

```ts
let cachedBundle: AuthorityRegistryBundle | null = null;
```

Implement `loadAuthorityRegistryBundle(force = false)` with this sequence:

1. return `cachedBundle` when present and `force === false`;
2. fetch both URLs with `{ cache: 'no-store' }`;
3. reject if either response is non-OK;
4. parse both documents;
5. require `version === 1`, required arrays, non-empty `updated`, unique project ids, unique invariant ids;
6. require each invariant owner and every consumer to refer to a known project id;
7. map project records through the existing `toContext(...)` function;
8. construct witness metadata from the exact two documents and source URLs;
9. assign `cachedBundle = nextBundle` only after every validation above succeeds;
10. return the new bundle.

Then implement compatibility by delegation:

```ts
export async function loadCollectiveRepositories(force = false): Promise<RepositoryContext[]> {
  return (await loadAuthorityRegistryBundle(force)).repositories;
}

export function clearAuthorityRegistryCache() {
  cachedBundle = null;
}
```

Do not silently filter malformed invariant references. Global registry shape/reference failures are loader failures; edge-local malformed evidence belongs to the pure projection tests in Task 2.

- [ ] **Step 7: Run the loader proof**

Run:

```bash
npm test -- tests/authorityKitRegistry.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit the loader boundary**

```bash
git add package.json src/types/nearbyGrowth.ts src/data/authorityKitRegistry.ts tests/fixtures/authorityRegistry.ts tests/authorityKitRegistry.test.ts
git commit -m "feat: load Authority Kit registry witness bundle"
```

---

### Task 2: Implement the pure deterministic Nearby Growth projection

**Files:**
- Create: `src/services/nearbyGrowth.ts`
- Create: `tests/nearbyGrowth.test.ts`
- Reuse: `tests/fixtures/authorityRegistry.ts`

**Interfaces:**
- Consumes: `NearbyGrowthInput` from `src/types/nearbyGrowth.ts`.
- Produces: `deriveNearbyGrowth(input: NearbyGrowthInput): NearbyGrowthResult`.

- [ ] **Step 1: Write the acceptance specimens first**

Create `tests/nearbyGrowth.test.ts` and assert these exact behaviors:

```ts
const corpus = deriveNearbyGrowth(inputFor(['corpus-os']));
assert.deepEqual(corpus.doors.map(door => door.projectId), ['tranchnode', 'project0']);
```

For `tranchnode`, assert both evidence channels exist:

```ts
assert.deepEqual(
  corpus.doors[0].evidence.map(item => item.kind),
  ['typed-relation', 'shared-invariant']
);
```

Add specimens:

- Toaster Lab → Haunted Toaster via `PROPOSES_TO`;
- Groove Rooms → Band Runtime via `EMBODIES`;
- Jubilee Authority Kit ↔ TranchNOSE via invariant-only `replay-from-recorded-state` when no direct project relation exists;
- removing the replay invariant removes TranchNOSE;
- unrelated creative project text never admits a door;
- output is identical after reversing project order, relation order, invariant order, consumer order, and proof-ref order;
- result never exceeds three doors;
- `monument`, `ancestor`, and `lineage-ancestor` candidates are excluded;
- a `dormant` explicitly evidenced candidate is retained with `status === 'dormant'`;
- unknown relation target yields no synthesized door and one stable diagnostic;
- unknown invariant participant yields no synthesized door and one stable diagnostic when supplied directly to the pure function fixture;
- a non-`proven` invariant does not admit a door;
- no evidence returns `doors: []` without error.

- [ ] **Step 2: Run the projection tests and verify they fail**

Run:

```bash
npm test -- tests/nearbyGrowth.test.ts
```

Expected: FAIL because `deriveNearbyGrowth` does not exist.

- [ ] **Step 3: Implement evidence normalization helpers**

Create `src/services/nearbyGrowth.ts`.

Define the operational relation tier exactly as:

```ts
const OPERATIONAL_RELATIONS = new Set([
  'DEPENDS_ON',
  'CONFORMS_TO',
  'PROPOSES_TO',
  'EMBODIES',
  'EXPORTS_TO',
  'RECORDS_IN',
  'PROJECTS_FROM'
]);
```

Define historical exclusion exactly as:

```ts
const isHistorical = (project: RepositoryContext) =>
  project.status === 'ancestor' ||
  project.status === 'monument' ||
  project.kind === 'lineage-ancestor';
```

Normalize/sort evidence records before ranking so shuffled input order cannot change output. For proof refs, use a stable key composed from:

```ts
`${ref.repository}|${ref.type}|${ref.number ?? ''}|${ref.commit ?? ''}`
```

- [ ] **Step 4: Implement candidate evidence collection**

For every routed project id `R`:

1. if `R` is unknown, add diagnostic `unknown routed project: ${R}` and continue;
2. collect outbound relation `R -> C` as `direction: 'outbound'`;
3. collect inbound relation `C -> R` as `direction: 'inbound'`;
4. for every `maturity === 'proven'` invariant, admit `C` only when:
   - `owner === R && consumers.includes(C)`;
   - `owner === C && consumers.includes(R)`;
   - `consumers.includes(R) && consumers.includes(C)`;
5. never use `claim`, `proof`, `formalRule`, repository role text, `owns`, or `nonAuthority` as relevance input.

When a relation/invariant names an unknown candidate id, add one deterministic diagnostic and do not create a door.

Deduplicate identical evidence records before ranking.

- [ ] **Step 5: Implement exact tiering and deterministic tie-breaks**

For each candidate:

```ts
const hasOperationalRelation = evidence.some(
  item => item.kind === 'typed-relation' && OPERATIONAL_RELATIONS.has(item.relationType)
);
const hasInvariant = evidence.some(item => item.kind === 'shared-invariant');
const hasAnyRelation = evidence.some(item => item.kind === 'typed-relation');

const tier = hasOperationalRelation ? 1 : hasInvariant ? 2 : hasAnyRelation ? 3 : 99;
const classCount = new Set(evidence.map(item => item.kind)).size;
const evidenceCount = evidence.length;
```

Sort by:

1. `tier` ascending;
2. `classCount` descending;
3. `evidenceCount` descending;
4. `projectId.localeCompare(...)` ascending.

Then take `.slice(0, 3)`.

Within each door, sort evidence deterministically with `typed-relation` before `shared-invariant`, then stable lexical keys.

- [ ] **Step 6: Return witness metadata without alteration**

Return:

```ts
return {
  doors,
  registryWitness: input.registryWitness,
  diagnostics: [...new Set(diagnostics)].sort()
};
```

Do not add current time, random ids, or network data.

- [ ] **Step 7: Run the projection proof**

Run:

```bash
npm test -- tests/nearbyGrowth.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit the pure projection**

```bash
git add src/services/nearbyGrowth.ts tests/nearbyGrowth.test.ts
git commit -m "feat: derive evidenced nearby growth"
```

---

### Task 3: Attach Nearby Growth only after Founder Node authority gates pass

**Files:**
- Create: `tests/compilerNearbyGrowth.test.ts`
- Modify: `src/types/founderNode.ts`
- Modify: `src/services/compilerEngine.ts`

**Interfaces:**
- Consumes:
  - `loadAuthorityRegistryBundle(force?)`
  - `deriveNearbyGrowth(input)`
  - existing `compileFounderIntent(options)` API.
- Produces: successful `CompiledIdea.nearbyGrowth?: NearbyGrowthResult`; blocked compilations omit it.

- [ ] **Step 1: Extend the compiled result type additively**

In `src/types/founderNode.ts`, use a type-only import:

```ts
import type { NearbyGrowthResult } from './nearbyGrowth';
```

Then add to `CompiledIdea`:

```ts
nearbyGrowth?: NearbyGrowthResult;
```

No existing required property becomes optional or changes meaning.

- [ ] **Step 2: Write successful local-fallback integration test**

In `tests/compilerNearbyGrowth.test.ts`, mock fetch so:

1. projects URL returns the fixture project document;
2. invariants URL returns the fixture invariant document;
3. `/api/compile-intent` throws to force the existing deterministic local fallback.

Call:

```ts
const compiled = await compileFounderIntent({
  rawText: 'work in corpus os',
  selectedTargetRepos: ['corpus-os'],
  requestedProposalTypes: ['specification']
});
```

Assert:

```ts
assert.equal(compiled.architecturalCheck.routingBlocked, false);
assert.deepEqual(compiled.nearbyGrowth?.doors.map(d => d.projectId), ['tranchnode', 'project0']);
assert.equal(compiled.nearbyGrowth?.registryWitness.projects.updated, '2026-08-09');
```

Also assert the ordinary routed `understanding.potentialRepositories` remains `['corpus-os']`; Nearby Growth must not replace primary routing.

- [ ] **Step 3: Write blocked-route tests before integration code**

Add two independent blocked cases:

1. **deterministic client block:** use a selected historical fixture project and assert `nearbyGrowth === undefined` plus `proposals.length === 0`;
2. **server semantic block:** allow deterministic routing, then return `/api/compile-intent` JSON with one high-severity `authorityConflict`; assert `nearbyGrowth === undefined`, `routingBlocked === true`, and `proposals.length === 0`.

This proves Nearby Growth cannot become an alternate path around either authority gate.

- [ ] **Step 4: Run integration tests and verify failure**

Run:

```bash
npm test -- tests/compilerNearbyGrowth.test.ts
```

Expected: FAIL because compiler output does not yet attach Nearby Growth.

- [ ] **Step 5: Load the registry bundle once at compiler entry**

Replace:

```ts
const repositories = await loadCollectiveRepositories();
```

with:

```ts
const registryBundle = await loadAuthorityRegistryBundle();
const repositories = registryBundle.repositories;
```

Do not fetch invariants separately in the compiler.

- [ ] **Step 6: Add one local helper that derives advisory growth**

Inside `compilerEngine.ts`, add:

```ts
const nearbyGrowthFor = (
  routing: RoutingResult,
  registryBundle: AuthorityRegistryBundle
): NearbyGrowthResult => deriveNearbyGrowth({
  routedProjectIds: routing.targets.map(repo => repo.id),
  projects: registryBundle.repositories,
  invariants: registryBundle.invariants,
  registryWitness: registryBundle.witness
});
```

Do not pass `rawText` to this helper.

- [ ] **Step 7: Preserve the deterministic client block unchanged**

Keep the early return before any Nearby Growth call:

```ts
if (routing.blocked) {
  return blockedCompilation(rawText, attachments, routing);
}
```

`blockedCompilation(...)` must not gain a `nearbyGrowth` property.

- [ ] **Step 8: Gate server-backed success correctly**

In the server-response branch:

1. compute `serverBlocked` exactly as the current code does from high-severity server conflicts;
2. when `serverBlocked === true`, keep `proposals: []` and omit `nearbyGrowth`;
3. when `serverBlocked === false`, attach:

```ts
nearbyGrowth: nearbyGrowthFor(routing, registryBundle)
```

Do not use server/Gemini text to alter the Nearby Growth evidence set.

- [ ] **Step 9: Attach Nearby Growth to deterministic local compilation**

Change `compileLocally(...)` to receive the already-derived `NearbyGrowthResult` or the registry bundle. Prefer deriving once immediately before the local return:

```ts
const local = compileLocally(...);
return {
  ...local,
  nearbyGrowth: nearbyGrowthFor(routing, registryBundle)
};
```

This keeps the pure projection outside proposal generation and avoids teaching `compileLocally` about invariant semantics.

- [ ] **Step 10: Run the integration proof and the previous tasks**

Run:

```bash
npm test -- tests/compilerNearbyGrowth.test.ts
npm test
```

Expected: all tests PASS.

- [ ] **Step 11: Commit the authority-gated integration**

```bash
git add src/types/founderNode.ts src/services/compilerEngine.ts tests/compilerNearbyGrowth.test.ts
git commit -m "feat: attach nearby growth after routing"
```

---

### Task 4: Render explainable nearby doors without creating a dispatch shortcut

**Files:**
- Create: `src/components/NearbyGrowthPanel.tsx`
- Create: `tests/NearbyGrowthPanel.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `NearbyGrowthResult` and `projectId` values already admitted by the pure projection.
- Produces:

```ts
interface NearbyGrowthPanelProps {
  result: NearbyGrowthResult;
  onChooseDoor?: (projectId: string) => void;
}
```

- [ ] **Step 1: Write zero-state and provenance render tests**

Use `renderToStaticMarkup` from `react-dom/server` in `tests/NearbyGrowthPanel.test.tsx`.

For `doors: []`, assert the markup contains:

```text
Evidenced Nearby Growth
No evidenced nearby growth yet.
projects 2026-08-09
invariants 2026-08-07
```

- [ ] **Step 2: Write an evidence-bearing door render test**

Render a Corpus → TranchNode door containing both evidence classes and assert markup contains:

```text
tranchnode
active
DEPENDS_ON → tranchnode
invariant: immutable-source
```

Also assert it does **not** contain `dispatch`, `approve`, or `create issue` action copy.

- [ ] **Step 3: Run the UI tests and verify failure**

Run:

```bash
npm test -- tests/NearbyGrowthPanel.test.tsx
```

Expected: FAIL because the panel does not exist.

- [ ] **Step 4: Implement the compact advisory panel**

Create `src/components/NearbyGrowthPanel.tsx` with:

- heading `Evidenced Nearby Growth`;
- provenance line:

```tsx
projects {result.registryWitness.projects.updated} · invariants {result.registryWitness.invariants.updated}
```

- zero-state exactly `No evidenced nearby growth yet.`;
- one card per door with repository/project identity and lifecycle status;
- evidence chips formatted exactly:
  - outbound typed relation: `${relationType} → ${targetProjectId}`;
  - inbound typed relation: `${sourceProjectId} → ${relationType}`;
  - invariant: `invariant: ${invariantId}`;
- optional button text `Review this door` only when `onChooseDoor` exists.

The button may call only:

```tsx
onClick={() => onChooseDoor?.(door.projectId)}
```

The component must not import compiler, dispatch, GitHub, storage, fetch, or mutation services.

- [ ] **Step 5: Wire the panel into successful compilation UI**

In `src/App.tsx`, import `NearbyGrowthPanel` and render it after the existing Understanding / Architectural Memory result block when:

```ts
lastCompiledIdea?.nearbyGrowth && !lastCompiledIdea.architecturalCheck.routingBlocked
```

Add an explicit human review handler:

```ts
const handleReviewNearbyDoor = async (projectId: RepositoryId) => {
  if (!lastCompiledIdea) return;
  await handleCompile(
    lastCompiledIdea.rawText,
    lastCompiledIdea.attachments,
    ['github_issue', 'specification', 'aistudio_prompt'],
    [projectId]
  );
};
```

Pass it as:

```tsx
<NearbyGrowthPanel
  result={lastCompiledIdea.nearbyGrowth}
  onChooseDoor={handleReviewNearbyDoor}
/>
```

This explicit click re-enters the existing compile/routing gate. Do not queue or dispatch any returned proposal automatically beyond the app's existing post-compilation behavior.

- [ ] **Step 6: Run UI and full test proofs**

Run:

```bash
npm test -- tests/NearbyGrowthPanel.test.tsx
npm test
```

Expected: all tests PASS.

- [ ] **Step 7: Commit the advisory UI**

```bash
git add src/components/NearbyGrowthPanel.tsx src/App.tsx tests/NearbyGrowthPanel.test.tsx
git commit -m "feat: show evidenced nearby growth"
```

---

### Task 5: Execute the full proof specimens and perform bounded cross-project review

**Files:**
- Modify only if a failing test reveals an in-scope defect in files already named above.
- Do not modify Jubilee Authority Kit merely to refresh unrelated metadata.

**Interfaces:**
- Consumes: complete v0.1 implementation.
- Produces: one exact Founder Node head SHA ready for Riqor review and PR Completion evaluation.

- [ ] **Step 1: Run the complete executable proof floor**

Run:

```bash
npm test
```

Expected: PASS for loader, projection, compiler integration, and static UI tests.

- [ ] **Step 2: Run targeted acceptance specimens separately so failures are attributable**

Run:

```bash
npm test -- tests/nearbyGrowth.test.ts
npm test -- tests/compilerNearbyGrowth.test.ts
npm test -- tests/NearbyGrowthPanel.test.tsx
```

Expected: all PASS.

- [ ] **Step 3: Record the pre-existing repository harness limitation without widening scope**

Run the existing commands for evidence only:

```bash
npm run lint
npm run build
```

If they fail solely because the pre-existing repository root still lacks `tsconfig.json` and/or `index.html`, record that exact limitation in the PR and do not add those unrelated files in this slice. If either command reveals an error caused by this slice inside a modified file, fix that in-scope error and rerun the command.

- [ ] **Step 4: Re-check only the load-bearing Authority Kit facts**

Immediately before final review, inspect current Authority Kit `registry/projects.json` and `registry/invariants.json` and verify:

```text
corpus-os DEPENDS_ON tranchnode
corpus-os CONFORMS_TO project0
toaster-lab PROPOSES_TO haunted-toaster
groove-rooms EMBODIES band-runtime
immutable-source owner=tranchnode consumers contains corpus-os
replay-from-recorded-state owner=tranchnose consumers contains jubilee-authority-kit
```

If all remain present, make **no Authority Kit mutation**.

If one acceptance fact has materially changed, stop the Founder Node finalization, reconcile that fact through a separate reviewed Authority Kit change, run `node registry/validate.mjs` in that repository, merge/review it independently, then return and rerun Founder Node tests against the updated registry fixture only when the changed fact is intentional and proven.

- [ ] **Step 5: Run an adversarial Riqor review**

Ask Riqor to attack these exact claims:

1. Can prompt text, `owns`, `nonAuthority`, role descriptions, or Gemini output admit a nearby door?
2. Can a blocked client or server route still produce Nearby Growth?
3. Can a monument/ancestor appear?
4. Can input ordering change output ordering?
5. Can a missing registry id manufacture a door instead of a diagnostic?
6. Can selecting a door queue/dispatch/create external work without re-entering normal compilation?
7. Does the UI imply a suggestion has authority rather than merely evidence of proximity?
8. Does the witness copy overstate the two network reads as an atomic snapshot?

Fix only findings that violate the approved spec.

- [ ] **Step 6: Compare branch scope to the approved design**

Run:

```bash
git diff --stat main...HEAD
git diff --name-only main...HEAD
```

Expected implementation scope after the design/plan docs:

```text
package.json
src/App.tsx
src/components/NearbyGrowthPanel.tsx
src/data/authorityKitRegistry.ts
src/services/compilerEngine.ts
src/services/nearbyGrowth.ts
src/types/founderNode.ts
src/types/nearbyGrowth.ts
tests/NearbyGrowthPanel.test.tsx
tests/authorityKitRegistry.test.ts
tests/compilerNearbyGrowth.test.ts
tests/fixtures/authorityRegistry.ts
tests/nearbyGrowth.test.ts
```

Plus the already-approved design and plan documents. Any unrelated file requires explicit justification or removal before review.

- [ ] **Step 7: Update the existing PR from design-only to implementation review only after all above proof passes**

The PR body must state:

- the governing law;
- exact two evidence classes;
- exact maximum-three deterministic ordering rule;
- no Authority Kit mutation was needed, if that remains true;
- observed registry metadata is provenance, not freshness authority;
- blocked routing suppresses Nearby Growth;
- human door selection re-enters ordinary routing;
- test commands/results;
- any pre-existing `lint`/`build` harness limitation separately from the new executable test floor;
- `PollenReceipt` remains deferred.

Do not mark the PR ready merely because code exists; mark it ready only when executable proofs and Riqor review are clean.

- [ ] **Step 8: Capture exact-head evidence for PR Completion**

Record:

```bash
git rev-parse HEAD
```

Then fetch the PR and verify its `head_sha` equals that exact SHA before asking for landing approval.

PR Completion must use that exact head. A later commit invalidates the landing confirmation and requires a fresh exact-head review.

---

## Self-Review Record

### Spec coverage

- Observed project + invariant registry pair and witness metadata: Task 1.
- Existing loader compatibility and fail-closed whole-bundle cache: Task 1.
- Two evidence classes only: Task 2.
- Proven-invariant exact owner/consumer rules: Task 2.
- Historical exclusion, dormant preservation, malformed-edge diagnostics: Task 2.
- Deterministic tiering and maximum three: Task 2.
- No prompt / semantic relevance path: Tasks 2 and 5 adversarial review.
- Client/server authority blocks suppress Nearby Growth: Task 3.
- Successful local and server-backed compilation attach advisory results only after gates: Task 3.
- Explainable UI, empty state, lifecycle status, and registry provenance: Task 4.
- Human selection re-enters ordinary routing and does not dispatch directly: Task 4.
- Authority Kit freshness reconciliation remains bounded and conditional: Global Constraints + Task 5.
- `PollenReceipt` deferred: Global Constraints + PR review checklist.

### Placeholder scan

No `TBD`, `TODO`, “add appropriate error handling,” “write tests for the above,” or undefined future abstraction is intentionally left in this plan. Every implementation task names files, interfaces, failing tests, minimal implementation behavior, verification commands, and a commit boundary.

### Type consistency

- `AuthorityRegistryBundle` is defined once in `src/types/nearbyGrowth.ts` and consumed by loader/compiler.
- `NearbyGrowthInput`, `NearbyGrowthResult`, `NearbyGrowthDoor`, and `NearbyGrowthEvidence` are defined once and reused by projection/compiler/UI.
- `CompiledIdea.nearbyGrowth?: NearbyGrowthResult` is additive and matches the UI/compiler contract.
- `deriveNearbyGrowth(input: NearbyGrowthInput): NearbyGrowthResult` is the single projection signature across Tasks 2–4.
- `loadAuthorityRegistryBundle(force?: boolean): Promise<AuthorityRegistryBundle>` is the single rich-loader signature across Tasks 1 and 3.
