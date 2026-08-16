# Pollen Scout / Evidenced Nearby Growth v0.1 — Design

## Status

Approved concept; written design awaiting explicit review before implementation planning.

## Purpose

Founder Node already routes unstructured founder intent through the Jubilee Authority Kit project registry and fails closed when a selected target disclaims the requested authority. The next bounded capability is to expose **nearby, explicitly evidenced ecosystem doors** after routing without turning suggestion into authority or opaque relevance scoring.

The governing law is:

> **Show only the neighboring doors the recorded ecosystem can explain. Never confuse relevance with authority, and never cross a door automatically.**

This is a local BEE transplant from the proven jublEchat Nearby Growth pattern: deterministic discovery from explicit lineage/friction evidence, with the evidence class visible for every result.

## Evidence motivating the slice

- Founder Node PR #1 is merged and already reads `jubilee-authority-kit/registry/projects.json` for project roles, typed relations, status, `owns`, and `nonAuthority` boundaries.
- Jubilee Authority Kit already carries a federated `registry/invariants.json` whose claims point back to project-owned proof and name known consumers.
- jublEchat PR #4 proved a deterministic `Nearby Growth` projection from explicit lineage/friction evidence while refusing embeddings, AI inference, persistence, and opaque relevance scoring.
- The BEE Protocol already states that a proven invariant may cross repositories only as evidence/pollen; donor authority must remain behind and the recipient must prove the transplant locally.
- Authority Kit registry metadata predates several newly landed executable proofs. v0.1 must surface registry provenance/freshness rather than silently pretending the registry is exhaustive.

## Scope

### In scope

1. Add one pure Founder Node projection, tentatively named `deriveNearbyGrowth(...)`.
2. Consume only the already-declared Authority Kit project and invariant registries.
3. Return zero to three explainable neighboring project doors after the ordinary routing decision.
4. Preserve the exact evidence classes that admitted each suggestion.
5. Preserve hard `nonAuthority` and historical-project stop rules already enforced by Founder Node.
6. Surface the Authority Kit registry snapshot metadata used for the projection so staleness is inspectable.
7. Add deterministic tests proving both positive suggestions and legitimate empty states.
8. Perform a bounded Authority Kit **freshness reconciliation** before the proof specimen only when a needed registry fact is demonstrably stale; no schema expansion is required for this slice.

### Out of scope

- automatic dispatch, issue creation, PR creation, or repository mutation from a suggestion;
- embeddings, semantic similarity, LLM relevance scoring, or taxonomy-only proximity;
- a universal recommendation engine;
- a shared runtime package consumed by every repository;
- automatic adoption of a donor invariant by a recipient;
- changing domain authority, canonical identity, artifact custody, or execution law;
- standardizing `PollenReceipt` v1;
- crawling arbitrary GitHub/GitBook content at runtime;
- treating Authority Kit as exhaustive truth about the ecosystem.

## Architecture

```text
founder intent
    ↓
existing compile / authority routing
    ↓
routed project target(s)
    ↓
Authority Kit registry snapshot
    ├── projects.json
    │    ├── typed relations
    │    ├── owns
    │    ├── nonAuthority
    │    └── lifecycle status
    └── invariants.json
         ├── owner
         ├── consumers
         ├── maturity
         └── proofRefs
    ↓
deriveNearbyGrowth(...)
    ↓
0..3 evidenced neighboring doors
    ↓
human attention only
```

The projection does not participate in the existing authority decision. Ordinary routing finishes first. Nearby Growth is derived afterward from the same witnessed registry context.

## Input contract

`deriveNearbyGrowth(...)` receives a frozen/read-only input equivalent to:

```ts
type NearbyGrowthInput = {
  routedProjectIds: string[];
  projects: AuthorityKitProject[];
  invariants: AuthorityKitInvariant[];
  registrySnapshot: {
    projectsVersion: number;
    projectsUpdated: string;
    invariantsVersion: number;
    invariantsUpdated: string;
  };
};
```

The implementation may use the existing loaded registry types rather than introduce these exact names, but the semantic boundary must remain the same.

No raw founder prompt is required by the projection. This prevents an LLM or text-similarity path from becoming a hidden relevance source.

## Admissible evidence classes

A neighboring project may be admitted only through one or more explicit classes:

### 1. `typed-relation`

The routed project declares a relation to the candidate, or the candidate declares a relation to the routed project, through the Authority Kit relation vocabulary.

Examples include `DEPENDS_ON`, `CONFORMS_TO`, `PROPOSES_TO`, `EMBODIES`, `EXPORTS_TO`, and explicit lineage/donation relations.

The relation direction and type must be preserved in the result.

### 2. `shared-invariant`

A proven invariant explicitly connects the routed project and candidate through owner/consumer declarations.

At least one side must be the invariant owner or an explicitly named consumer. Mere thematic resemblance to the invariant claim is insufficient.

Only `maturity: "proven"` invariants may admit a v0.1 suggestion.

### 3. `explicit-proof-reference`

A project may appear when a proven invariant already names project-owned proof that directly explains the cross-project connection and the target project is explicitly represented in that invariant's consumer/owner declarations.

This class may strengthen another class but must not become free-form PR-text mining.

## Candidate refusal rules

A candidate is excluded when any of the following is true:

1. it is already one of the routed projects;
2. it does not have an admissible evidence class;
3. the proposed relation would require the routed project to exercise a capability declared in its `nonAuthority` list;
4. the candidate is an `ancestor`, `monument`, or lineage-only historical project unless the existing Founder Node compilation already records explicit revival intent;
5. the evidence depends only on taxonomy/category similarity;
6. the evidence requires interpreting prose that is not represented in the registries;
7. the registry entry is malformed or refers to a missing project id.

Malformed evidence fails closed for that edge; it must not make all ordinary routing unusable.

## Deterministic ordering and bound

The projection returns at most three projects.

Rank without opaque scoring:

1. direct typed execution/composition relations (`DEPENDS_ON`, `CONFORMS_TO`, `PROPOSES_TO`, `EMBODIES`, `EXPORTS_TO`, `RECORDS_IN`, `PROJECTS_FROM`);
2. shared proven invariant evidence;
3. lineage/pattern-donation relations when current lifecycle status permits them.

Within the same evidence tier:

1. more independent explicit evidence classes first;
2. candidate project id ascending as final deterministic tie-break.

The numeric tier order is part of the v0.1 contract. No learned or heuristic score is introduced.

## Output contract

Each suggestion is evidence-bearing:

```ts
type NearbyGrowthDoor = {
  projectId: string;
  repository: string;
  role: string;
  evidence: Array<
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
        proofRefs: unknown[];
      }
  >;
};
```

The UI may render this more compactly, but every visible door must answer **why is this here?** without consulting implementation code.

The projection also returns the registry snapshot metadata used to derive the results.

## UI behavior

The existing routing/architectural-memory result remains primary.

Nearby Growth appears as a small secondary section after successful routing:

- heading: **Evidenced Nearby Growth**;
- zero-state: **No evidenced nearby growth yet.**;
- each card shows project/repository identity plus concise evidence chips such as `DEPENDS_ON → tranchnode`, `CONFORMS_TO → project0`, or `invariant: immutable-source`;
- clicking/selecting a door may place that project into ordinary Founder Node review context, but must not queue, dispatch, or mutate anything automatically.

No large navigation redesign is part of v0.1.

## Authority Kit freshness reconciliation

The existing Authority Kit registry remains the source of the projection. v0.1 does not introduce automatic registry synthesis.

Before the proof specimen, inspect only load-bearing registry facts used by the acceptance cases. If a fact is demonstrably stale relative to merged project-owned evidence, update Authority Kit through its normal reviewed registry process.

Rules:

- do not add speculative relations;
- do not mark an invariant `proven` without project-owned executable evidence;
- do not infer a consumer merely because an invariant seems useful there;
- preserve `updated` metadata honestly;
- Founder Node must expose the snapshot dates it actually consumed.

This turns registry freshness into visible provenance instead of hidden confidence.

## Error handling

### Authority Kit unavailable or globally malformed

Preserve Founder Node's existing fail-closed authority-routing behavior. Do not fall back to stale hand-maintained authority claims.

### Nearby Growth-specific malformed edge

Skip/refuse the malformed suggestion and retain the ordinary routed result. Nearby Growth is advisory and must not make valid routing less available.

### Unknown project reference

Exclude the candidate and emit a diagnostic suitable for tests/logging. Never synthesize the missing project.

### No evidence

Return `[]`. This is a valid result, not an error.

## Proof specimens

### Specimen A — Corpus OS

Given Corpus OS as the routed target and the current registry:

- TranchNode should be admitted through explicit dependency evidence;
- Project0 should be admitted through explicit conformance evidence;
- unrelated creative repositories must not appear merely because their descriptions contain similar words.

### Specimen B — proposal → execution

Given Toaster Lab as the routed target:

- Haunted Toaster should be admitted through the explicit `PROPOSES_TO` edge;
- the result must not imply that Toaster Lab gained VisualScore admission or render authority.

### Specimen C — embodiment

Given Groove Rooms as the routed target:

- Band Runtime should be admitted through the explicit `EMBODIES` relation;
- the UI must preserve that the relationship explains proximity, not execution authority.

### Specimen D — negative control

Given a routed project with no explicit relation or proven invariant path to a tempting candidate:

- the tempting candidate must not appear;
- the result may be empty.

### Specimen E — evidence removal

Remove one supporting relation/invariant from a test fixture:

- the corresponding door must disappear unless another independent admissible class still supports it.

This proves the projection is evidence-derived rather than hardcoded.

## Testing strategy

1. **Pure projection tests**
   - deterministic output under shuffled registry input order;
   - maximum three results;
   - exact evidence preservation;
   - valid empty state;
   - malformed/missing references fail closed locally;
   - lifecycle and `nonAuthority` exclusions;
   - evidence removal changes the output predictably.

2. **Compiler integration tests**
   - existing authority routing result is unchanged;
   - nearby suggestions appear only after successful routing;
   - routing-blocked intent produces no downstream suggestions that could bypass the block.

3. **UI tests**
   - visible evidence reason for every card;
   - zero-state text;
   - selection is non-mutating until the existing human review/dispatch machinery is used.

4. **Authority Kit validation**
   - any freshness reconciliation must pass the existing registry validator;
   - no schema or relation vocabulary expansion unless separately designed.

## Compatibility

Additive.

Existing routing, proposal generation, dispatch, receipt behavior, and Authority Kit authority boundaries remain unchanged. Nearby Growth is a derived advisory projection.

## Success condition

The slice succeeds when Founder Node can answer both questions separately:

1. **Where does this work belong?** — existing authority-aware routing.
2. **Which neighboring door is explicitly evidenced by the ecosystem we already have?** — new Nearby Growth projection.

Every neighboring answer must be reconstructible from Authority Kit registry evidence, disappear when that evidence disappears, and grant no new authority by being shown.

## Explicit deferred frontier

After several real cross-project uses produce stable evidence, a later design may standardize a `PollenReceipt` containing donor specimen, extracted invariant, recipient hypothesis, local proof requirement, and disposition (`admitted | refused | deferred`).

v0.1 intentionally stops before that abstraction.
