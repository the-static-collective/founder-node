# Pollen Scout / Evidenced Nearby Growth v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Execution status (2026-08-16):** Executed inline. `tests/NearbyGrowthPanel.test.tsx` became `tests/NearbyGrowthPanel.test.ts` because `tsx --test` auto-discovers `.test.ts` but not `.test.tsx`; the test contains no JSX. A thin `src/services/compileFounderIntent.ts` wrapper attaches advisory output only after the existing compiler gate because the connector refused a large full-file rewrite of `compilerEngine.ts`. Existing routing semantics remain primary.

**Goal:** Add an advisory, deterministic Founder Node projection that shows at most three neighboring project doors only when Authority Kit machine-readable evidence explicitly supports them, while preserving existing routing authority and visible registry provenance.

**Governing law:** **Show only the neighboring doors the recorded ecosystem can explain. Never confuse relevance with authority, and never cross a door automatically.**

## Constraints

- Only Authority Kit `projects.json` and `invariants.json` feed Nearby Growth.
- Exactly two evidence classes: `typed-relation` and `shared-invariant`.
- No embeddings, semantic similarity, LLM relevance, taxonomy-only proximity, runtime crawling, or free-text `owns` / `nonAuthority` interpretation inside the projection.
- The registry files are an observed pair, not an atomic snapshot.
- Forced reload replaces the cache only after both documents validate.
- Only `maturity: "proven"` invariants admit a door.
- Blocked routing suppresses Nearby Growth.
- Historical candidates are excluded; dormant candidates retain dormant status.
- Maximum three deterministic doors.
- A door grants no authority and performs no dispatch/repository mutation.
- Selecting a door re-enters ordinary Founder Node compilation.
- `PollenReceipt` remains deferred.
- No Authority Kit mutation is required by the final freshness check.

## Implemented files

Created:
- `src/types/nearbyGrowth.ts`
- `src/services/nearbyGrowth.ts`
- `src/services/compileFounderIntent.ts`
- `src/components/NearbyGrowthPanel.tsx`
- `tests/fixtures/authorityRegistry.ts`
- `tests/authorityKitRegistry.test.ts`
- `tests/nearbyGrowth.test.ts`
- `tests/compilerNearbyGrowth.test.ts`
- `tests/NearbyGrowthPanel.test.ts`

Modified:
- `package.json`
- `src/data/authorityKitRegistry.ts`
- `src/types/founderNode.ts`
- `src/App.tsx`

## Execution record

### Task 1 — Registry witness bundle
- [x] Test command added with no new dependency.
- [x] Dual-document loader and whole-bundle cache implemented.
- [x] Version, duplicate-id, owner/consumer, cache atomicity, and cache-clear specimens.
- [x] 9 loader tests pass.

### Task 2 — Pure Nearby Growth
- [x] Corpus, Toaster, Groove Rooms, invariant-only, negative, historical, dormant, malformed-reference, and ordering specimens.
- [x] Exactly two evidence classes, deterministic tiering, max-three bound, stable diagnostics.
- [x] 13 projection tests pass.

### Task 3 — Authority integration
- [x] `CompiledIdea` extended additively.
- [x] Thin post-routing compiler wrapper preserves the existing compiler as authority entrypoint.
- [x] Deterministic and server high-severity refusals return unchanged with no Nearby Growth.
- [x] Riqor regression proves server/model output cannot substitute a different nearby target.
- [x] 4 compiler integration tests pass.

### Task 4 — Advisory UI
- [x] Evidence-bearing panel and legitimate zero state implemented.
- [x] Independent project/invariant dates visible.
- [x] `Review this door` re-enters `handleCompile(...)`; no queue/dispatch shortcut.
- [x] UI test renamed to `.test.ts` so full `tsx --test` discovery includes it.
- [x] 2 UI render tests pass.

### Task 5 — Review
- [x] Fresh local equivalent Node 22 TypeScript proof: **28/28 pass**.
- [x] Live Authority Kit acceptance edges/invariants re-checked; no write required.
- [x] Riqor owner-style review completed; two test-quality gaps found and corrected.
- [x] Branch scope remains design/plan + bounded implementation/tests only.
- [x] Repository harness limitations kept explicit: no `tsconfig.json`; verification mirror has no installed Vite/tsx packages.
- [x] No CI statuses or workflow runs exist on the PR head, so exact-head landing still requires a separate PR Completion decision.

## Final self-review

- Prompt/model prose cannot directly admit a Nearby Growth door.
- Both authority refusal paths suppress Nearby Growth.
- Historical nodes remain excluded.
- Ordering and cap are deterministic.
- Missing references diagnose rather than manufacture state.
- Human selection re-enters ordinary compilation.
- UI says evidence/review, not authority/dispatch.
- Witness metadata never claims atomicity.
- `PollenReceipt` remains deferred.
