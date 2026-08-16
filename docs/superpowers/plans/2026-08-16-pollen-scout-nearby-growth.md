# Pollen Scout / Evidenced Nearby Growth v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Execution status (2026-08-16):** Executed inline. One bounded implementation adjustment was made during review: `tests/NearbyGrowthPanel.test.tsx` became `tests/NearbyGrowthPanel.test.ts` because `tsx --test` auto-discovers TypeScript `.test.ts` files but not `.test.tsx`; the test itself contains no JSX. A thin `src/services/compileFounderIntent.ts` wrapper was used to attach advisory output after the existing compiler gate when the connector refused a large full-file rewrite of `compilerEngine.ts`. Existing routing semantics remain primary.

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
- `src/services/compileFounderIntent.ts` — thin post-routing wrapper that attaches advisory Nearby Growth only when the existing compiler result is unblocked.
- `src/components/NearbyGrowthPanel.tsx` — small advisory UI surface that renders doors, evidence reasons, lifecycle status, and observed registry dates.
- `tests/fixtures/authorityRegistry.ts` — focused frozen registry fixtures used by loader/projection/compiler/UI tests.
- `tests/authorityKitRegistry.test.ts` — bundle-loader compatibility, validation, atomic cache replacement, and force-reload tests.
- `tests/nearbyGrowth.test.ts` — projection acceptance specimens, ordering, malformed-edge diagnostics, and negative controls.
- `tests/compilerNearbyGrowth.test.ts` — successful-routing and blocked-routing integration tests.
- `tests/NearbyGrowthPanel.test.ts` — dependency-free static-render assertions for evidence, zero-state, and provenance copy.

### Modify

- `package.json` — add a test script using the existing `tsx` dev dependency; no new package dependency.
- `src/data/authorityKitRegistry.ts` — add invariant URL, rich bundle loader, validation, witness metadata, and whole-bundle cache while keeping `loadCollectiveRepositories()`.
- `src/types/founderNode.ts` — allow successful `CompiledIdea` values to carry optional advisory `nearbyGrowth` without changing existing required fields.
- `src/App.tsx` — use the wrapper compiler, render `NearbyGrowthPanel` after a successful compilation, and route an explicit human door selection back through `handleCompile(...)` using the selected project id.

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

- [x] **Step 1: Add the repository-independent Node test command**

Replace the `scripts` section in `package.json` with the same existing scripts plus:

```json
"test": "tsx --test"
```

Do not add Vitest, Jest, Testing Library, jsdom, or any other dependency.

- [x] **Step 2: Create the shared Nearby Growth / Authority Kit types**

Create `src/types/nearbyGrowth.ts` with the approved Authority Kit bundle, witness, evidence, door, input, and result contracts.

- [x] **Step 3: Add focused frozen test fixtures**

Create `tests/fixtures/authorityRegistry.ts` with explicit Corpus, Toaster, Groove Rooms, invariant-only, historical, and dormant specimens.

- [x] **Step 4: Write failing loader tests before changing the loader**

The loader tests cover version refusal, duplicate ids, invalid owner/consumer references, whole-bundle cache replacement, and cache clearing.

- [x] **Step 5: Run the tests and verify the new interface is missing**

Red state observed before implementation.

- [x] **Step 6: Implement the minimal whole-bundle loader**

The loader reads both registry documents, validates the cross-document references needed by the projection, exposes independent witness metadata, and replaces the cached bundle only after both documents validate.

- [x] **Step 7: Run the loader proof**

Fresh local verification: 9 loader tests pass.

- [x] **Step 8: Commit the loader boundary**

Implemented on the isolated PR branch.

---

### Task 2: Implement the pure deterministic Nearby Growth projection

**Files:**
- Create: `src/services/nearbyGrowth.ts`
- Create: `tests/nearbyGrowth.test.ts`
- Reuse: `tests/fixtures/authorityRegistry.ts`

**Interfaces:**
- Consumes: `NearbyGrowthInput` from `src/types/nearbyGrowth.ts`.
- Produces: `deriveNearbyGrowth(input: NearbyGrowthInput): NearbyGrowthResult`.

- [x] **Step 1: Write the acceptance specimens first**

Corpus, proposal→execution, embodiment, invariant-only, negative, historical, dormant, malformed-reference, and ordering specimens are covered.

- [x] **Step 2: Run the projection tests and verify they fail**

Red state observed before `deriveNearbyGrowth` existed.

- [x] **Step 3: Implement evidence normalization helpers**

Operational-relation tier, historical exclusion, stable proof-ref keys, and deterministic evidence ordering implemented.

- [x] **Step 4: Implement candidate evidence collection**

Only typed relations and proven invariant participants admit candidates. Prompt text, roles, `owns`, `nonAuthority`, and model output are not relevance inputs.

- [x] **Step 5: Implement exact tiering and deterministic tie-breaks**

Operational relation → proven invariant → other relation; class count, evidence count, then project id; capped at three.

- [x] **Step 6: Return witness metadata without alteration**

No clock, random id, or network lookup enters the projection.

- [x] **Step 7: Run the projection proof**

Fresh local verification: 13 projection tests pass.

- [x] **Step 8: Commit the pure projection**

Implemented on the isolated PR branch.

---

### Task 3: Attach Nearby Growth only after Founder Node authority gates pass

**Files:**
- Create: `src/services/compileFounderIntent.ts`
- Create: `tests/compilerNearbyGrowth.test.ts`
- Modify: `src/types/founderNode.ts`

**Interfaces:**
- Consumes:
  - existing `compileFounderIntent(options)` authority-aware compiler;
  - `loadAuthorityRegistryBundle(force?)`;
  - `deriveNearbyGrowth(input)`.
- Produces: successful `CompiledIdea.nearbyGrowth?: NearbyGrowthResult`; blocked compilations omit it.

- [x] **Step 1: Extend the compiled result type additively**

`CompiledIdea.nearbyGrowth?: NearbyGrowthResult` is additive.

- [x] **Step 2: Write successful local-fallback integration test**

Corpus remains primary routed target while TranchNode/Project0 appear only as advisory neighboring doors.

- [x] **Step 3: Write blocked-route tests before integration code**

Both deterministic historical refusal and server high-severity refusal suppress Nearby Growth and proposals.

- [x] **Step 4: Run integration tests and verify failure**

Red state observed: successful route lacked advisory output while refusal tests already held.

- [x] **Step 5: Preserve the existing compiler as the authority entrypoint**

A connector safety gate refused a large full-file rewrite of `compilerEngine.ts`. The bounded correction was a thin wrapper: call the existing compiler first, return blocked results unchanged, and attach advisory output only to successful results.

- [x] **Step 6: Derive advisory growth only from the compiler's deterministic routed ids**

The wrapper consumes `compiled.understanding.potentialRepositories`, which the existing compiler overwrites with its own resolved targets even when the server returns different model suggestions.

- [x] **Step 7: Preserve deterministic and server authority blocks unchanged**

Blocked results return before bundle-derived Nearby Growth is attached.

- [x] **Step 8: Prove Gemini/server output cannot steer Nearby Growth**

Riqor review added a regression where the server proposes `haunted-toaster` while deterministic routing selects `corpus-os`; output remains Corpus neighbors only.

- [x] **Step 9: Run the integration proof and previous tasks**

Fresh local verification: 4 compiler-integration tests pass; combined loader/projection/compiler floor passes.

- [x] **Step 10: Commit the authority-gated integration**

Implemented on the isolated PR branch.

---

### Task 4: Render explainable nearby doors without creating a dispatch shortcut

**Files:**
- Create: `src/components/NearbyGrowthPanel.tsx`
- Create: `tests/NearbyGrowthPanel.test.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `NearbyGrowthResult` and `projectId` values already admitted by the pure projection.
- Produces an advisory panel and optional `Review this door` callback only.

- [x] **Step 1: Write zero-state and provenance render tests**

Covers heading, legitimate empty state, and independent project/invariant dates.

- [x] **Step 2: Write an evidence-bearing door render test**

Covers lifecycle status, typed relation label, invariant label, and absence of dispatch/approve/create-issue language.

- [x] **Step 3: Run the UI tests and verify failure**

The local Node proof initially exposed an environment-only `.tsx` entrypoint limitation; the same React.createElement component logic was then executed through a temporary `.ts` copy for the red/green cycle.

- [x] **Step 4: Implement the compact advisory panel**

The component has no compiler, dispatch, GitHub, storage, fetch, or mutation dependency.

- [x] **Step 5: Wire the panel into successful compilation UI**

`Review this door` calls the existing `handleCompile(...)` with the selected project id. It does not queue or dispatch anything itself.

- [x] **Step 6: Correct full-suite test discovery**

Riqor review found that `tsx --test` does not auto-discover `.test.tsx`; because the UI test contains no JSX, it was renamed to `tests/NearbyGrowthPanel.test.ts` so the repository-level full test command includes it.

- [x] **Step 7: Run UI and full executable proofs**

Fresh local equivalent Node 22 TypeScript proof: 28 tests pass, 0 fail. The sandbox cannot run literal `tsx --test` because `tsx` is not installed locally and outbound package installation is unavailable.

---

### Task 5: Execute the full proof specimens and perform bounded cross-project review

- [x] **Step 1: Run the complete executable proof floor**

Fresh local equivalent Node 22 TypeScript proof: **28/28 pass**.

- [x] **Step 2: Run targeted acceptance specimens separately**

Loader, projection, compiler integration, and static UI specimens all pass independently.

- [x] **Step 3: Record repository harness limitations without widening scope**

`npm run lint` remains non-operative because the repository has no `tsconfig.json`. In the verification mirror, `npm run build` cannot start because Vite dependencies are not installed. Neither result is counted as feature proof, and no unrelated harness files were added.

- [x] **Step 4: Re-check only the load-bearing Authority Kit facts**

All required relations and invariant owner/consumer facts remain present. **No Authority Kit mutation was made.**

- [x] **Step 5: Run an adversarial Riqor review**

Riqor reviewer criteria were applied to prompt/model steering, both authority blocks, historical exclusion, deterministic ordering, missing ids, selection behavior, UI authority language, and witness semantics. Two test-quality gaps were found and corrected: explicit model-steering regression coverage and `.tsx` full-suite discovery.

- [x] **Step 6: Compare branch scope to the approved design**

Scope remains limited to design/plan, loader/projection/compiler wrapper/UI, and their tests. No Authority Kit or unrelated product files changed.

- [x] **Step 7: Update the existing PR from design-only to implementation review**

PR metadata is updated separately after this plan record.

- [x] **Step 8: Capture exact-head evidence for PR Completion**

The exact head must be re-fetched after this status commit and PR metadata update. Any later code commit invalidates prior landing readiness.

---

## Final Self-Review Record

- Two evidence classes only: `typed-relation`, `shared-invariant`.
- Maximum three deterministic neighbors.
- Model/prompt prose cannot directly enter the Nearby Growth projection.
- Client and server routing refusals suppress Nearby Growth.
- Historical candidates are excluded; dormant explicit evidence remains visible as dormant.
- Unknown references diagnose rather than manufacture candidates.
- Human selection re-enters ordinary compilation; no dispatch shortcut exists.
- Registry dates are displayed as independent observed provenance and never called an atomic snapshot.
- `PollenReceipt` remains deferred.
- No Authority Kit mutation was needed.
