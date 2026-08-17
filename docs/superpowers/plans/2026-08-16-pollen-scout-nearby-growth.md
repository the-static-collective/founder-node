# Pollen Scout / Evidenced Nearby Growth v0.1 Implementation Plan

**Execution status (2026-08-16):** Executed inline under the approved design.

**Goal:** Add an advisory, deterministic Founder Node projection that shows at most three neighboring project doors only when Authority Kit machine-readable evidence explicitly supports them, while preserving existing routing authority and visible registry provenance.

**Governing law:** **Show only the neighboring doors the recorded ecosystem can explain. Never confuse relevance with authority, and never cross a door automatically.**

## Bounded implementation notes

- `src/services/compileFounderIntent.ts` is a thin post-routing wrapper because the connector refused a large full-file rewrite of `compilerEngine.ts`; the existing compiler remains the authority entrypoint.
- `tests/NearbyGrowthPanel.test.ts` uses `.ts`, not `.tsx`, because `tsx --test` auto-discovers `.test.ts`; the test contains no JSX.
- No Authority Kit mutation was needed after the final freshness check.
- `PollenReceipt` remains deferred.

## Proof record

- [x] 9 loader tests pass.
- [x] 13 pure projection tests pass.
- [x] 4 compiler integration tests pass, including model/server steering refusal.
- [x] 2 static UI tests pass.
- [x] Fresh local equivalent Node 22 TypeScript proof: **28/28 pass, 0 fail**.
- [x] Deterministic and server high-severity route blocks suppress Nearby Growth.
- [x] Historical candidates remain excluded; dormant explicitly evidenced candidates retain status.
- [x] Ordering is stable under shuffled projects, relations, invariants, consumers, and proof refs.
- [x] Missing references diagnose rather than manufacture candidates.
- [x] `Review this door` re-enters ordinary `handleCompile(...)`; it does not queue or dispatch.
- [x] Independent registry dates are shown without atomic-snapshot claims.
- [x] Riqor owner-style review found two test-quality gaps; both were corrected.
- [x] Live Authority Kit acceptance edges/invariants were re-checked; no write required.
- [x] Branch scope remains bounded.

## Harness evidence

The repository still has no `tsconfig.json`, so `npm run lint` is not an operative project gate. The verification mirror has no installed Vite/tsx packages, so literal `npm test` / `npm run build` cannot be executed there. Those limitations are not counted as feature success; the 28/28 Node 22 TypeScript proof is the executable evidence available in this environment.

## Final self-review

- Exactly two evidence classes: `typed-relation`, `shared-invariant`.
- Maximum three deterministic neighbors.
- Prompt/model prose cannot directly enter Nearby Growth relevance.
- Both authority refusal paths suppress Nearby Growth.
- Human selection re-enters normal compilation.
- UI communicates evidence/review, not authority/dispatch.
- Registry witness metadata remains non-atomic provenance.
- `PollenReceipt` remains deferred.
