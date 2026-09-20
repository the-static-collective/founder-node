import type { CompiledIdea, RepositoryContext } from '../types/founderNode';
import type { AuthorityRegistryWitness, AuthorityInvariantRecord, NearbyGrowthResult, NearbyGrowthEvidence } from '../types/nearbyGrowth';

/**
 * A non-executing projection of recorded project claims, not a dependency resolver.
 * Nothing here establishes installation, compatibility, readiness or permission.
 */
export interface EcosystemNode {
  projectId: string;
  repository: string;
  status: RepositoryContext['status'];
  role: string;
  owns: string[];
  nonAuthority: string[];
}

export interface EcosystemEdge {
  from: string;
  to: string;
  kind: 'declared-relation' | 'proven-invariant';
  reference: string;
}

export interface CompositionParticipant extends EcosystemNode {
  evidence: NearbyGrowthEvidence[];
}

export interface CompositionDraft {
  schema: 'static-collective.founder-node.composition-draft.v0.1';
  state: 'proposal-only';
  anchorProjectIds: string[];
  participants: CompositionParticipant[];
  registryWitness: AuthorityRegistryWitness;
  unknowns: string[];
  nonClaims: string[];
}

export interface EcosystemComposition {
  nodes: EcosystemNode[];
  edges: EcosystemEdge[];
  diagnostics: string[];
  draft: CompositionDraft | null;
}

export interface WorkbenchInspectionHandoff {
  schema: 'static-collective.founder-node.workbench-inspection.v0.1';
  mode: 'descriptor-only';
  origin: 'founder-node';
  proposedParticipants: CompositionParticipant[];
  sourceRegistry: AuthorityRegistryWitness;
  localReadiness: 'unknown';
  compatibility: 'unverified';
  executionAuthorized: false;
  destinationAcceptance: 'not-requested';
  requestedNextStep: 'Human may inspect locally installed projects and independently review each project-owned interface.';
  nonClaims: string[];
}

export interface FounderIntentWitness {
  schema: 'static-collective.founder-node.intent-witness.v0.1';
  id: string;
  compiledIdeaId: string;
  observedAt: string;
  rawIntent: string;
  interpretation: string[];
  routedProjectIds: string[];
  routingDisposition: 'blocked' | 'proposed';
  nonClaims: string[];
}

const nodeOf = (project: RepositoryContext): EcosystemNode => ({
  projectId: project.id,
  repository: project.repository,
  status: project.status,
  role: project.role,
  owns: [...project.owns],
  nonAuthority: [...project.nonAuthority]
});

const isCurrent = (project: RepositoryContext) =>
  project.status !== 'ancestor' && project.status !== 'monument' &&
  project.kind !== 'lineage-ancestor';

const viableForDraft = (project: RepositoryContext) =>
  isCurrent(project) && (project.status === 'active' || project.status === 'seed');

const PROPOSAL_NON_CLAIMS = [
  'Recorded relation or invariant does not prove an executable integration.',
  'Project presence, readiness, compatibility, admission and authority remain separate.',
  'Founder intent does not authorize another project or participant.',
  'No project is started, mutated or dispatched by this proposal.'
];

export function deriveEcosystemComposition(input: {
  routedProjectIds: string[];
  projects: RepositoryContext[];
  invariants: AuthorityInvariantRecord[];
  nearbyGrowth: NearbyGrowthResult;
  registryWitness: AuthorityRegistryWitness;
}): EcosystemComposition {
  const byId = new Map(input.projects.map(p => [p.id, p]));
  const nodes = [...input.projects].sort((a, b) => a.id.localeCompare(b.id)).map(nodeOf);
  const edges: EcosystemEdge[] = [];
  const diagnostics: string[] = [];

  for (const project of input.projects) {
    for (const relation of project.relations) {
      if (!byId.has(relation.target)) {
        diagnostics.push('unknown relation target: ' + project.id + ' -> ' + relation.target);
        continue;
      }
      edges.push({ from: project.id, to: relation.target, kind: 'declared-relation', reference: relation.type });
    }
  }
  for (const invariant of input.invariants) {
    if (invariant.maturity !== 'proven') continue;
    if (!byId.has(invariant.owner)) {
      diagnostics.push('unknown invariant owner: ' + invariant.id);
      continue;
    }
    for (const consumer of invariant.consumers) {
      if (!byId.has(consumer)) {
        diagnostics.push('unknown invariant consumer: ' + invariant.id + ' -> ' + consumer);
        continue;
      }
      edges.push({ from: invariant.owner, to: consumer, kind: 'proven-invariant', reference: invariant.id });
    }
  }
  edges.sort((a, b) =>
    [a.from, a.to, a.kind, a.reference].join('|').localeCompare([b.from, b.to, b.kind, b.reference].join('|'))
  );

  // Pollen Scout has already applied evidence and authority gates. Compose only its
  // locally derived doors, and never invent a missing participant from role/name text.
  const anchors = [...new Set(input.routedProjectIds)].sort()
    .map(id => byId.get(id)).filter((p): p is RepositoryContext => !!p && viableForDraft(p));
  const anchorIds = new Set(anchors.map(p => p.id));
  const candidates = input.nearbyGrowth.doors
    .map(door => ({ door, project: byId.get(door.projectId) }))
    .filter((entry): entry is { door: typeof input.nearbyGrowth.doors[number]; project: RepositoryContext } =>
      !!entry.project && viableForDraft(entry.project) && !anchorIds.has(entry.project.id) && entry.door.evidence.length > 0
    );

  // Two nearby doors yield a multi-organ specimen; one door still yields a
  // two-party draft. Absence of evidence produces no proposal at all.
  const selectedAnchors = anchors.slice(0, 2);
  const selectedNeighbors = candidates.slice(0, 2);
  const draft: CompositionDraft | null = selectedAnchors.length && selectedNeighbors.length
    ? {
        schema: 'static-collective.founder-node.composition-draft.v0.1',
        state: 'proposal-only',
        anchorProjectIds: selectedAnchors.map(p => p.id),
        participants: [
          ...selectedAnchors.map(p => ({ ...nodeOf(p), evidence: [] as NearbyGrowthEvidence[] })),
          ...selectedNeighbors.map(({ project, door }) => ({ ...nodeOf(project), evidence: door.evidence }))
        ],
        registryWitness: input.registryWitness,
        unknowns: [
          'Local checkout or service availability has not been inspected.',
          'Actual interface compatibility and destination admission are unverified.',
          'Evidence connecting neighboring doors to one another has not been established.'
        ],
        nonClaims: [...PROPOSAL_NON_CLAIMS]
      }
    : null;

  return { nodes, edges, diagnostics: [...new Set(diagnostics)].sort(), draft };
}

export function createWorkbenchInspectionHandoff(draft: CompositionDraft): WorkbenchInspectionHandoff {
  if (draft.state !== 'proposal-only' || draft.participants.length < 2) {
    throw new Error('Only a bounded, unexecuted multi-project proposal may be handed off.');
  }
  return {
    schema: 'static-collective.founder-node.workbench-inspection.v0.1',
    mode: 'descriptor-only',
    origin: 'founder-node',
    proposedParticipants: draft.participants.map(p => ({ ...p, owns: [...p.owns], nonAuthority: [...p.nonAuthority], evidence: [...p.evidence] })),
    sourceRegistry: draft.registryWitness,
    localReadiness: 'unknown',
    compatibility: 'unverified',
    executionAuthorized: false,
    destinationAcceptance: 'not-requested',
    requestedNextStep: 'Human may inspect locally installed projects and independently review each project-owned interface.',
    nonClaims: [...draft.nonClaims, 'This is a copyable inspection descriptor, not an adapter invocation or a command.']
  };
}

/** Explicitly chosen browser-local testimony; neither a signed receipt nor canon. */
export function makeFounderIntentWitness(compiled: CompiledIdea, id: string, observedAt: string): FounderIntentWitness {
  if (!id.trim() || !Number.isFinite(Date.parse(observedAt))) throw new Error('A witness needs an id and an observation time.');
  return {
    schema: 'static-collective.founder-node.intent-witness.v0.1',
    id,
    compiledIdeaId: compiled.id,
    observedAt,
    rawIntent: compiled.rawText,
    interpretation: [...compiled.understanding.goals],
    routedProjectIds: [...compiled.understanding.potentialRepositories],
    routingDisposition: compiled.architecturalCheck.routingBlocked ? 'blocked' : 'proposed',
    nonClaims: [
      'This records a local founder-intent observation, not the founder\'s permanent will.',
      'Interpretation does not overwrite the original words.',
      'This browser-local record is user-editable and is not a cryptographic or project-native receipt.',
      'Founder intent does not transfer authority to or from a participant or repository.'
    ]
  };
}

export function appendFounderIntentWitness(history: readonly FounderIntentWitness[], next: FounderIntentWitness): FounderIntentWitness[] {
  if (history.some(w => w.id === next.id || w.compiledIdeaId === next.compiledIdeaId)) {
    throw new Error('This compiled intent is already recorded; later reconsideration needs its own occurrence.');
  }
  return [...history, next];
}
