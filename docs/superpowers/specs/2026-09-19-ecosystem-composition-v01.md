# Ecosystem Composition v0.1 — bounded Founder Node crater-smash

Status: proposed branch implementation, pending verification and review. Historical August Pollen Scout status remains intact.

## The distinction

Founder Node can orient a human to the Collective's project-owned boundaries and suggest evidenced compositions. Static Workbench provides a local Linux operator desk; it does not own other projects. The Collective is not reducible to either interface. A founding intention is historically attributable testimony, not standing authority over later participants.

The four separate transitions are:

```
founder intent -> possible composition -> locally demonstrated readiness -> independently authorized project action
```

This slice implements the first two as a view, with a descriptor-only invitation to inspect the third. It implements neither local readiness verification nor project execution.

## Inputs and provenance

- Reuses the project and invariant registry witnesses loaded by the existing Founder Node Authority Kit reader, and the already gated Pollen Scout result.
- Keeps the full project map as separately typed declared relations and proven shared-invariant edges. Those edges represent registry claims, not installed dependencies or runtime integrations.
- Rechecks candidate evidence against the currently loaded registry before admitting it to a composition draft. Textual similarity, model output, unknown identifiers, historical donors and dormant projects cannot alone admit participants.
- Proposes at most two routed origin projects and two neighboring projects with recorded evidence to at least one routed origin. It does not infer an integration between all neighbors.
- If no supported neighboring door exists, displays an empty state and emits no composition or handoff.
- Preserves independent project/invariant registry dates; a non-atomic pair is not misrepresented as a synchronized snapshot.

## Outputs

- `ecosystemComposition`: descriptive map, diagnostics and optional proposal-only composition.
- `static-collective.founder-node.workbench-inspection.v0.1`: user-copyable JSON descriptor with origin, participants, original registry witness and explicit unknown/unauthorized states. No shell command, API invocation, installation, activation, credentials or transfer of admission. Workbench does not yet consume this schema; manual copy is not an integration.
- `static-collective.founder-node.intent-witness.v0.1`: human-selected browser-local record preserving the raw founder statement separately from its compilation goals and routing status. It is neither cryptographically signed nor tamper-resistant or project-native. The current UI can witness a particular compilation once. Later reconsiderations require a new compilation and new witness; no founder-intent auto-promotion into canon.
- UI lives under Idea Stream only after normal compilation succeeds and the existing authority gate has not blocked routing. It does not alter the separate existing dispatch or proposal workflows.

## Constraints, proof and counterexamples

- Relevance is visibility, not authorization. Presence is not readiness. Compatibility is not admission. The founder is not a universal project owner.
- A fraudulent supplied Pollen Scout door must not become a proposal unless the registry itself supports its evidence.
- Missing edges are diagnosed instead of synthesized; no composition proposed without evidence.
- Tests cover deterministic order, historical/dormant exclusions, spoofed candidate evidence, descriptor-only output and source-versus-interpretation continuity.
- The pre-existing Founder Node UI includes a legacy simulated dispatch/receipt surface. This slice neither treats that simulation as actual execution nor expands it. It should be reconciled separately before any real operational dispatch.

## Future authorized work

1. Independently pin/check participating projects' own adapter contracts and proof specimens.
2. Workbench may optionally implement a parser for this inspection descriptor, but must verify input, local availability, compatibility and explicit human admission itself.
3. Use project-native receipts when actual project actions occur; Workbench and Founder Node may only record their own observations.
4. Founder-intent continuity beyond browser-local testimony needs a separately owned, append-only, recoverable storage specification and explicit consent.
