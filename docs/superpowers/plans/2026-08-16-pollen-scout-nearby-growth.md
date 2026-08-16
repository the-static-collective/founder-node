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

- [x] Add the repository-independent Node test command.
- [x] Create shared Nearby Growth / Authority Kit types.
- [x] Add focused frozen test fixtures.
- [x] Write loader tests before changing the loader and observe red state.
- [x] Implement the minimal whole-bundle loader.
- [x] Verify 9 loader tests pass.
- [x] Commit the loader boundary.

---

### Task 2: Implement the pure deterministic Nearby Growth projection

- [x] Write Corpus, proposal→execution, embodiment, invariant-only, negative, historical, dormant, malformed-reference, and ordering specimens first.
- [x] Observe red state before `deriveNearbyGrowth` exists.
- [x] Implement evidence normalization, candidate collection, exact tiering, deterministic tie-breaks, and witness passthrough.
- [x] Verify 13 projection tests pass.
- [x] Commit the pure projection.

---

### Task 3: Attach Nearby Growth only after Founder Node authority gates pass

- [x] Extend `CompiledIdea` additively.
- [x] Write successful local-fallback and blocked-route integration tests before integration code.
- [x] Observe the successful route red state while refusal tests already hold.
- [x] Preserve the existing compiler as the authority entrypoint using a thin post-routing wrapper after a connector safety gate refused a large full-file rewrite.
- [x] Derive advisory growth only from compiler-resolved project ids.
- [x] Preserve deterministic and server authority blocks unchanged.
- [x] Add Riqor regression proving model/server output cannot substitute a different nearby target.
- [x] Verify 4 compiler integration tests pass.
- [x] Commit the authority-gated integration.

---

### Task 4: Render explainable nearby doors without creating a dispatch shortcut

- [x] Write zero-state, provenance, and evidence-bearing render tests.
- [x] Implement the compact advisory panel.
- [x] Wire `Review this door` back through ordinary `handleCompile(...)` with the selected project id.
- [x] Riqor correction: rename UI test from `.test.tsx` to `.test.ts` so `tsx --test` auto-discovers it.
- [x] Verify 2 UI render tests pass.

---

### Task 5: Execute the full proof specimens and perform bounded cross-project review

- [x] Fresh local equivalent Node 22 TypeScript proof: **28/28 pass**.
- [x] Record harness limitations without widening scope: repository has no `tsconfig.json`; local verification mirror lacks installed Vite/tsx dependencies.
- [x] Re-check Authority Kit load-bearing relations and invariants; no mutation required.
- [x] Run adversarial Riqor reviewer pass across prompt/model steering, both authority blocks, historical exclusion, deterministic ordering, missing ids, selection behavior, UI authority language, and witness semantics.
- [x] Correct two test-quality gaps found by review: model-steering regression and `.tsx` discovery.
- [x] Compare branch scope against approved design; no Authority Kit or unrelated product files changed.
- [x] Update design status and PR metadata to reflect implementation review.
- [x] Re-fetch exact head before any landing decision. Any later code commit invalidates prior landing evidence.

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
