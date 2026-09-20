# Founder Node

Founder Node is an operating console for turning unstructured founder intent into reviewable project routing without granting the console authority over the projects it observes.

Its current executable center is deliberately narrower than the original concept mockup: it reads the Static Collective's Authority Kit project registry, routes intent through explicit project boundaries, and now exposes **Pollen Scout / Evidenced Nearby Growth v0.1**—up to three neighboring project doors that can be explained by recorded ecosystem evidence.

> **Show only the neighboring doors the recorded ecosystem can explain. Never confuse relevance with authority, and never cross a door automatically.**

## What works now

### Authority-aware project routing

Founder Node loads the Authority Kit project registry and uses project roles, declared boundaries, and routing rules as input to the existing compiler/routing gate.

Ordinary project routing stays independently available even if the optional invariant registry is unavailable.

### Pollen Scout / Evidenced Nearby Growth v0.1

After ordinary routing succeeds, Founder Node may load an explicitly non-atomic registry pair:

- `projects.json`;
- `invariants.json`.

It then derives nearby project doors through exactly two admissible evidence classes:

- `typed-relation`;
- `shared-invariant`.

The projection is pure and deterministic over the observed registry inputs. It returns at most three doors with explicit evidence and stable ordering.

It excludes:

- ancestors, monuments, and lineage ancestors;
- unknown references;
- taxonomy-only similarity;
- prompt/model “relevance” prose;
- invariants that are not recorded as proven.

A deterministic or server high-severity routing refusal suppresses Nearby Growth rather than allowing a suggestion layer to bypass the authority gate.

### Human review remains the crossing

The UI renders an **Evidenced Nearby Growth** panel with lifecycle state, evidence reasons, and independent registry dates.

`Review this door` re-enters ordinary compilation. It does **not**:

- queue work;
- dispatch a payload;
- create a GitHub issue or pull request;
- mutate a destination repository;
- grant authority to the suggested project.

Tests also prove that server/model output cannot substitute its own Nearby Growth target.

### Repository boot is real again

The current mainline includes a normal Vite/React entrypoint, so the advertised application build can actually run. The merged Pollen Scout proof passed 29/29 tests and a production Vite build at its verified PR head.


## Ecosystem Composition v0.1 — proposal-only development slice

Founder Node now offers a bounded **Ecosystem Composition** view after a successful, authority-gated compilation. The map distinguishes recorded typed relationships from proven shared invariants. A composition draft uses only evidenced Pollen Scout neighbors, independently checked against the registry, with at most two origin projects and two nearby participants.

The new **Copy Workbench inspection descriptor** button copies reviewable JSON for human-mediated inspection. Workbench does **not** yet consume this schema, accept the handoff, check local readiness, or execute anything through it. Origin project, participating projects and the local workbench retain separate authority. The descriptor explicitly says `executionAuthorized: false`, `localReadiness: unknown`, and `compatibility: unverified`.

A separate **Record this compiled intent locally** action stores an opted-in, browser-local witness of the original founder words and the compiler's interpretation, without rewriting older observations. Browser localStorage is not an append-only secure ledger, and these observations are not canon or project-native receipts.

The original Pollen Scout milestone and registry routing gate remain intact. The legacy simulated dispatch UI is unchanged and does not establish actual external execution. See [the bounded v0.1 specification](docs/superpowers/specs/2026-09-19-ecosystem-composition-v01.md).

## What this README no longer claims

Earlier concept text described voice transcription, OCR, autonomous dispatch queues, and cryptographically signed execution receipts as if they were already implemented product capabilities.

They are not part of the presently proven surface and are therefore not advertised here as current behavior.

`PollenReceipt` is also explicitly deferred.

## Run it

```bash
npm install
npm test
npm run build
npm run dev
```

Machine-readable snapshot: [`PROJECT_STATUS.json`](PROJECT_STATUS.json).

## Current direction

The next useful growth is not “more automation.” It is better lawful adjacency: letting a human see which neighboring project doors are evidenced, why they are evidenced, and then deliberately re-enter the normal authority path if one deserves attention.

Relevance affects visibility only. Authority stays with the project that owns the action.
