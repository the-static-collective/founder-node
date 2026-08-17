# Pollen Scout / Evidenced Nearby Growth v0.1 — Design

## Status

Approved 2026-08-16; implementation executed inline on the design branch under the companion Superpowers implementation plan.

## Purpose

Founder Node already routes unstructured founder intent through the Jubilee Authority Kit project registry and fails closed when a selected target disclaims the requested authority. The next bounded capability is to expose **nearby, explicitly evidenced ecosystem doors** after routing without turning suggestion into authority or opaque relevance scoring.

The governing law is:

> **Show only the neighboring doors the recorded ecosystem can explain. Never confuse relevance with authority, and never cross a door automatically.**

This is a local BEE transplant from the proven jublEchat Nearby Growth pattern: deterministic discovery from explicit lineage/friction evidence, with the evidence class visible for every result.

## Evidence motivating the slice

- Founder Node PR #1 is merged and already reads `jubilee-authority-kit/registry/projects.json` for project roles, typed relations, status, `owns`, and `nonAuthority` boundaries.
- The current Founder Node loader reads only `projects.json`; it does not yet expose Authority Kit `registry/invariants.json` or registry observation metadata to downstream projections.
- Jubilee Authority Kit already carries a federated `registry/invariants.json` whose claims point back to project-owned proof and name known consumers.
- jublEchat PR #4 proved a deterministic `Nearby Growth` projection from explicit lineage/friction evidence while refusing embeddings, AI inference, persistence, and opaque relevance scoring.
- The BEE Protocol already states that a proven invariant may cross repositories only as evidence/pollen; donor authority must remain behind and the recipient must prove the transplant locally.
- Authority Kit registry metadata predates several newly landed executable proofs. v0.1 must expose the registry pair it actually observed rather than silently pretending the registries are exhaustive or atomically current.

## Scope

### In scope

1. Extend Founder Node's Authority Kit loader so one read boundary can expose:
   - project records;
   - proven invariant records;
   - the independent `version` / `updated` metadata observed from each registry document.
2. Preserve the existing `loadCollectiveRepositories()` behavior for current callers.
3. Add one pure Founder Node projection, tentatively named `deriveNearbyGrowth(...)`.
4. Consume only Authority Kit registry data already represented in `projects.json` and `invariants.json`.
5. Return zero to three explainable neighboring project doors after the ordinary routing decision.
6. Preserve the exact evidence that admitted each suggestion.
7. Preserve the existing authority gate by deriving nearby growth only after `routingBlocked === false`.
8. Add deterministic tests proving positive suggestions, invariant-only suggestions, and legitimate empty states.
9. Perform a bounded Authority Kit freshness reconciliation only if a load-bearing acceptance fact is demonstrably stale; no schema or relation-vocabulary expansion is required for this slice.

### Out of scope

- automatic dispatch, issue creation, PR creation, or repository mutation from a suggestion;
- embeddings, semantic similarity, LLM relevance scoring, or taxonomy-only proximity;
- interpreting free-text `owns` / `nonAuthority` strings inside the Nearby Growth projection;
- a universal recommendation engine;
- a shared runtime package consumed by every repository;
- automatic adoption of a donor invariant by a recipient;
- changing domain authority, canonical identity, artifact custody, or execution law;
- standardizing `PollenReceipt` v1;
- crawling arbitrary GitHub/GitBook content at runtime;
- treating Authority Kit as exhaustive truth about the ecosystem;
- claiming the separately fetched project and invariant documents form an atomic Git commit snapshot.

## Architecture

```text
founder intent
    ↓
existing resolveTargets(...)
    ↓
existing checkRouting(...)
    ↓
blocked? ── yes ──> existing blocked result; no Nearby Growth
    │
    no
    ↓
routed project target(s)
    +
Authority Kit registry witness
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

The projection does not participate in the authority decision. Existing routing completes first. Nearby Growth is derived afterward from the same project registry context plus the invariant registry.

## Registry witness boundary

Founder Node currently fetches `projects.json` directly from Authority Kit `main`. v0.1 may add a second direct read of `invariants.json`, but must describe the result honestly.

The two remote files are an **observed registry pair**, not an atomic source snapshot. They may theoretically change between requests.

The loader therefore exposes metadata equivalent to:

```ts
type AuthorityRegistryWitness = {
  projects: {
    version: number;
    updated: string;
    source: string;
  };
  invariants: {
    version: number;
    updated: string;
    source: string;
  };
};
```

No commit SHA is invented when one was not actually observed.

Projection determinism is defined over the supplied parsed registry documents. Network freshness is a separate provenance concern.

## Loader compatibility

Introduce a richer loader boundary equivalent to:

```ts
type AuthorityRegistryBundle = {
  repositories: RepositoryContext[];
  invariants: AuthorityInvariantRecord[];
  witness: AuthorityRegistryWitness;
};

loadAuthorityRegistryBundle(force?: boolean): Promise<AuthorityRegistryBundle>
```

`loadCollectiveRepositories(force?)` remains available and delegates to the richer loader so existing compilation behavior does not break.

The cache must represent one observed bundle. A forced reload refreshes both documents before replacing the cached bundle.

If either required registry is unavailable or globally malformed, preserve the existing fail-closed Authority Kit behavior rather than silently combining a fresh document with a stale hidden fallback.

## Nearby Growth input contract

`deriveNearbyGrowth(...)` receives a frozen/read-only input equivalent to:

```ts
type NearbyGrowthInput = {
  routedProjectIds: string[];
  projects: RepositoryContext[];
  invariants: AuthorityInvariantRecord[];
  registryWitness: AuthorityRegistryWitness;
};
```

No raw founder prompt is required by the projection. This prevents an LLM, keyword matcher, or free-text `nonAuthority` interpretation from becoming a hidden relevance source.

## Admissible evidence classes

A neighboring project may be admitted only through one or both explicit classes below.

### 1. `typed-relation`

The routed project declares a relation to the candidate, or the candidate declares a relation to the routed project, through the Authority Kit relation vocabulary.

The relation direction and type must be preserved in the result.

Examples include `DEPENDS_ON`, `CONFORMS_TO`, `PROPOSES_TO`, `EMBODIES`, `EXPORTS_TO`, `RECORDS_IN`, `PROJECTS_FROM`, `DESCENDS_FROM`, and `DONATES_PATTERN_TO`.

### 2. `shared-invariant`

A `maturity: "proven"` invariant explicitly connects the routed project and candidate through its `owner` and `consumers` declarations.

For a routed project `R` and candidate `C`, the invariant admits the edge only when one of these exact conditions holds:

- `owner === R` and `consumers` contains `C`;
- `owner === C` and `consumers` contains `R`;
- `consumers` contains both `R` and `C`.

The invariant's `proofRefs` travel as evidence metadata. They strengthen inspectability; they are not a third independent relevance class and are never mined as free-form PR text.

Mere thematic resemblance to the invariant claim is insufficient.

## Candidate refusal rules

A candidate is excluded when any of the following is true:

1. it is already one of the routed projects;
2. it does not have an admissible evidence class;
3. it is classified as `status: "ancestor"`, `status: "monument"`, or `kind: "lineage-ancestor"`;
4. a relation or invariant references a missing/unknown project id;
5. the evidence depends only on taxonomy/category similarity;
6. the evidence would require interpreting prose outside the machine-readable registries.

Malformed evidence fails closed for that edge; it must not manufacture a candidate.

Dormant projects are not automatically historical ancestors. If explicit machine-readable evidence points to a dormant project, v0.1 may show it as a nearby door while preserving its lifecycle status in the result. Selection still does not dispatch work.

## Authority preservation

Nearby Growth never tries to decide whether the founder's requested capability matches a candidate's free-text `nonAuthority` declarations. The existing compiler already owns that semantic check because it has the raw founder intent.

Therefore:

1. `deriveNearbyGrowth(...)` runs only when the current compilation is not routing-blocked;
2. a suggestion grants no authority and queues nothing;
3. if the human chooses a suggested project as a work target, that choice re-enters the ordinary Founder Node compilation/routing path;
4. the ordinary path re-runs historical-revival and `nonAuthority` checks before proposals can be emitted.

A nearby door can affect attention. It cannot bypass admission.

## Deterministic ordering and bound

The projection returns at most three projects.

Rank without opaque scoring:

1. current operational/composition typed relations:
   `DEPENDS_ON`, `CONFORMS_TO`, `PROPOSES_TO`, `EMBODIES`, `EXPORTS_TO`, `RECORDS_IN`, `PROJECTS_FROM`;
2. shared proven invariant evidence;
3. remaining explicit relation types such as lineage or pattern donation when the candidate is not excluded by lifecycle rules.

Within the same tier:

1. more independent evidence classes first (`typed-relation` + `shared-invariant` before only one);
2. more explicit evidence records within that class first;
3. candidate project id ascending as the final deterministic tie-break.

The tier order is part of the v0.1 contract. No learned or heuristic score is introduced.

## Output contract

Each suggestion is evidence-bearing:

```ts
type NearbyGrowthDoor = {
  projectId: string;
  repository: string;
  role: string;
  status: RepositoryStatus;
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

type NearbyGrowthResult = {
  doors: NearbyGrowthDoor[];
  registryWitness: AuthorityRegistryWitness;
  diagnostics: string[];
};
```

The UI may render this more compactly, but every visible door must answer **why is this here?** without consulting implementation code.

Diagnostics are non-authoritative observations for malformed/missing edges; they do not create suggestions.

## UI behavior

The existing routing/architectural-memory result remains primary.

Nearby Growth appears as a small secondary section after successful routing:

- heading: **Evidenced Nearby Growth**;
- zero-state: **No evidenced nearby growth yet.**;
- each card shows project/repository identity, lifecycle status when useful, and concise evidence chips such as `DEPENDS_ON → tranchnode`, `CONFORMS_TO → project0`, or `invariant: immutable-source`;
- the section exposes the observed Authority Kit project/invariant `updated` metadata in compact provenance detail;
- choosing a door may feed that project into ordinary Founder Node review/compile context, but must not queue, dispatch, or mutate anything automatically.

No large navigation redesign is part of v0.1.

## Authority Kit freshness reconciliation

The existing Authority Kit registries remain the source of the projection. v0.1 does not introduce automatic registry synthesis.

Before the proof specimen, inspect only load-bearing registry facts used by the acceptance cases. If one is demonstrably stale relative to merged project-owned evidence, update Authority Kit through its normal reviewed registry process.

Rules:

- do not add speculative relations;
- do not mark an invariant `proven` without project-owned executable evidence;
- do not infer a consumer merely because an invariant seems useful there;
- preserve each document's `updated` metadata honestly;
- Founder Node must expose the metadata it actually observed;
- no Authority Kit mutation is required merely because newer unrelated proofs exist.

This turns freshness into visible provenance instead of hidden confidence.

## Error handling

### Authority Kit unavailable or globally malformed

Preserve Founder Node's existing fail-closed authority-routing behavior. Do not fall back to stale hand-maintained authority claims.

### Nearby Growth-specific malformed edge

Skip/refuse the malformed suggestion and retain the ordinary routed result. Nearby Growth is advisory and must not make valid routing less available after a successfully loaded registry bundle.

### Unknown project reference

Exclude the candidate and add a deterministic diagnostic. Never synthesize the missing project.

### No evidence

Return `doors: []`. This is a valid result, not an error.

## Proof specimens

### Specimen A — Corpus OS

Given Corpus OS as the routed target and the current registry:

- TranchNode should be admitted through explicit `DEPENDS_ON` evidence;
- the existing proven `immutable-source` invariant may independently strengthen the Corpus OS ↔ TranchNode explanation when its owner/consumer declarations match;
- Project0 should be admitted through explicit `CONFORMS_TO` evidence;
- unrelated creative repositories must not appear merely because their descriptions contain similar words.

### Specimen B — proposal → execution

Given Toaster Lab as the routed target:

- Haunted Toaster should be admitted through the explicit `PROPOSES_TO` edge;
- the result must not imply that Toaster Lab gained VisualScore admission or render authority.

### Specimen C — embodiment

Given Groove Rooms as the routed target:

- Band Runtime should be admitted through the explicit `EMBODIES` relation;
- the UI must preserve that the relationship explains proximity, not execution authority.

### Specimen D — invariant-only neighbor

Using a frozen Authority Kit fixture containing the current proven `replay-from-recorded-state` invariant:

- Jubilee Authority Kit and TranchNOSE should become neighbors through the exact owner/consumer declaration even if no direct project relation connects them in the fixture;
- removing that invariant must remove the door.

This proves invariants are a real second evidence channel rather than decoration on typed relations.

### Specimen E — negative control

Given a routed project with no explicit relation or proven invariant path to a tempting candidate:

- the tempting candidate must not appear;
- the result may be empty.

### Specimen F — authority block preservation

Given an intent that the existing compiler blocks through historical or `nonAuthority` rules:

- Nearby Growth must not be produced as an alternate route around the refusal;
- the existing blocked compilation remains authoritative for that attempt.

## Testing strategy

1. **Registry loader tests**
   - both version-1 documents required;
   - duplicate/missing ids fail closed;
   - unsupported invariant maturity/version shape is rejected or explicitly ignored according to the parser contract;
   - forced reload replaces the full observed bundle rather than one half;
   - existing `loadCollectiveRepositories()` behavior remains compatible.

2. **Pure projection tests**
   - deterministic output under shuffled project, invariant, relation, consumer, and proof-ref input order;
   - maximum three results;
   - exact evidence preservation;
   - valid empty state;
   - malformed/missing references fail closed locally;
   - historical lifecycle exclusions;
   - dormant status preserved rather than silently promoted;
   - evidence removal changes output predictably;
   - invariant-only admission works.

3. **Compiler integration tests**
   - existing authority routing result is unchanged;
   - nearby suggestions appear only after successful routing;
   - routing-blocked intent produces no downstream suggestions that could bypass the block.

4. **UI tests**
   - visible evidence reason for every card;
   - zero-state text;
   - observed registry metadata is inspectable;
   - selection is non-mutating until the ordinary human review/dispatch machinery is used.

5. **Authority Kit validation**
   - any freshness reconciliation passes the existing registry validator;
   - no schema or relation-vocabulary expansion unless separately designed.

## Compatibility

Additive.

Existing routing, proposal generation, dispatch, receipt behavior, and Authority Kit authority boundaries remain unchanged. Existing callers of `loadCollectiveRepositories()` keep their current contract. Nearby Growth is a derived advisory projection.

## Success condition

The slice succeeds when Founder Node can answer both questions separately:

1. **Where does this work belong?** — existing authority-aware routing.
2. **Which neighboring door is explicitly evidenced by the ecosystem we already have?** — new Nearby Growth projection.

Every neighboring answer must be reconstructible from Authority Kit machine-readable evidence, disappear when that evidence disappears, expose the registry pair it was derived from, and grant no new authority by being shown.

## Explicit deferred frontier

After several real cross-project uses produce stable evidence, a later design may standardize a `PollenReceipt` containing donor specimen, extracted invariant, recipient hypothesis, local proof requirement, and disposition (`admitted | refused | deferred`).

v0.1 intentionally stops before that abstraction.
