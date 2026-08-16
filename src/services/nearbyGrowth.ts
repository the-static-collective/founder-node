import type { RepositoryContext } from '../types/founderNode';
import type {
  AuthorityProofRef,
  NearbyGrowthDoor,
  NearbyGrowthEvidence,
  NearbyGrowthInput,
  NearbyGrowthResult
} from '../types/nearbyGrowth';

const OPERATIONAL_RELATIONS = new Set([
  'DEPENDS_ON',
  'CONFORMS_TO',
  'PROPOSES_TO',
  'EMBODIES',
  'EXPORTS_TO',
  'RECORDS_IN',
  'PROJECTS_FROM'
]);

const isHistorical = (project: RepositoryContext) =>
  project.status === 'ancestor' ||
  project.status === 'monument' ||
  project.kind === 'lineage-ancestor';

const proofRefKey = (ref: AuthorityProofRef) =>
  `${ref.repository}|${ref.type}|${ref.number ?? ''}|${ref.commit ?? ''}`;

const sortedProofRefs = (refs: AuthorityProofRef[]) =>
  [...refs].sort((a, b) => proofRefKey(a).localeCompare(proofRefKey(b)));

const relationEvidenceKey = (evidence: Extract<NearbyGrowthEvidence, { kind: 'typed-relation' }>) =>
  `${evidence.relationType}|${evidence.direction}|${evidence.sourceProjectId}|${evidence.targetProjectId}`;

const invariantEvidenceKey = (evidence: Extract<NearbyGrowthEvidence, { kind: 'shared-invariant' }>) =>
  `${evidence.invariantId}|${evidence.ownerProjectId}|${evidence.proofRefs.map(proofRefKey).join(',')}`;

const evidenceKey = (evidence: NearbyGrowthEvidence) =>
  evidence.kind === 'typed-relation'
    ? `0|${relationEvidenceKey(evidence)}`
    : `1|${invariantEvidenceKey(evidence)}`;

const sortedEvidence = (evidence: NearbyGrowthEvidence[]) => {
  const unique = new Map<string, NearbyGrowthEvidence>();
  for (const item of evidence) unique.set(evidenceKey(item), item);
  return [...unique.values()].sort((a, b) => evidenceKey(a).localeCompare(evidenceKey(b)));
};

export function deriveNearbyGrowth(input: NearbyGrowthInput): NearbyGrowthResult {
  const projectsById = new Map(input.projects.map(project => [project.id, project]));
  const routedIds = [...new Set(input.routedProjectIds)].sort();
  const routedSet = new Set(routedIds);
  const candidateEvidence = new Map<string, NearbyGrowthEvidence[]>();
  const diagnostics: string[] = [];

  const addEvidence = (candidateId: string, evidence: NearbyGrowthEvidence) => {
    const existing = candidateEvidence.get(candidateId) ?? [];
    existing.push(evidence);
    candidateEvidence.set(candidateId, existing);
  };

  const addUnknownInvariantParticipant = (invariantId: string, participantId: string) => {
    diagnostics.push(`unknown invariant participant: ${invariantId} -> ${participantId}`);
  };

  for (const routedId of routedIds) {
    const routed = projectsById.get(routedId);
    if (!routed) {
      diagnostics.push(`unknown routed project: ${routedId}`);
      continue;
    }

    const outboundRelations = [...routed.relations].sort((a, b) =>
      `${a.type}|${a.target}`.localeCompare(`${b.type}|${b.target}`)
    );
    for (const relation of outboundRelations) {
      if (!projectsById.has(relation.target)) {
        diagnostics.push(`unknown relation target: ${routedId} -> ${relation.target}`);
        continue;
      }
      addEvidence(relation.target, {
        kind: 'typed-relation',
        relationType: relation.type,
        direction: 'outbound',
        sourceProjectId: routedId,
        targetProjectId: relation.target
      });
    }

    const possibleSources = [...input.projects].sort((a, b) => a.id.localeCompare(b.id));
    for (const source of possibleSources) {
      const inboundRelations = [...source.relations]
        .filter(relation => relation.target === routedId)
        .sort((a, b) => `${a.type}|${a.target}`.localeCompare(`${b.type}|${b.target}`));
      for (const relation of inboundRelations) {
        addEvidence(source.id, {
          kind: 'typed-relation',
          relationType: relation.type,
          direction: 'inbound',
          sourceProjectId: source.id,
          targetProjectId: routedId
        });
      }
    }

    const provenInvariants = [...input.invariants]
      .filter(invariant => invariant.maturity === 'proven')
      .sort((a, b) => a.id.localeCompare(b.id));

    for (const invariant of provenInvariants) {
      const ownerKnown = projectsById.has(invariant.owner);
      const sortedConsumers = [...invariant.consumers].sort();

      if (invariant.owner === routedId) {
        for (const consumer of sortedConsumers) {
          if (!projectsById.has(consumer)) {
            addUnknownInvariantParticipant(invariant.id, consumer);
            continue;
          }
          addEvidence(consumer, {
            kind: 'shared-invariant',
            invariantId: invariant.id,
            ownerProjectId: invariant.owner,
            proofRefs: sortedProofRefs(invariant.proofRefs)
          });
        }
      }

      if (sortedConsumers.includes(routedId)) {
        if (!ownerKnown) {
          addUnknownInvariantParticipant(invariant.id, invariant.owner);
        } else if (invariant.owner !== routedId) {
          addEvidence(invariant.owner, {
            kind: 'shared-invariant',
            invariantId: invariant.id,
            ownerProjectId: invariant.owner,
            proofRefs: sortedProofRefs(invariant.proofRefs)
          });
        }

        for (const consumer of sortedConsumers) {
          if (consumer === routedId) continue;
          if (!projectsById.has(consumer)) {
            addUnknownInvariantParticipant(invariant.id, consumer);
            continue;
          }
          addEvidence(consumer, {
            kind: 'shared-invariant',
            invariantId: invariant.id,
            ownerProjectId: invariant.owner,
            proofRefs: sortedProofRefs(invariant.proofRefs)
          });
        }
      }
    }
  }

  const candidates = [...candidateEvidence.entries()]
    .filter(([projectId]) => !routedSet.has(projectId))
    .flatMap(([projectId, evidence]): NearbyGrowthDoor[] => {
      const project = projectsById.get(projectId);
      if (!project || isHistorical(project)) return [];
      return [{
        projectId,
        repository: project.repository,
        role: project.role,
        status: project.status,
        evidence: sortedEvidence(evidence)
      }];
    })
    .map(door => {
      const hasOperationalRelation = door.evidence.some(
        item => item.kind === 'typed-relation' && OPERATIONAL_RELATIONS.has(item.relationType)
      );
      const hasInvariant = door.evidence.some(item => item.kind === 'shared-invariant');
      const hasAnyRelation = door.evidence.some(item => item.kind === 'typed-relation');
      const tier = hasOperationalRelation ? 1 : hasInvariant ? 2 : hasAnyRelation ? 3 : 99;
      const classCount = new Set(door.evidence.map(item => item.kind)).size;
      return { door, tier, classCount, evidenceCount: door.evidence.length };
    })
    .sort((a, b) =>
      a.tier - b.tier ||
      b.classCount - a.classCount ||
      b.evidenceCount - a.evidenceCount ||
      a.door.projectId.localeCompare(b.door.projectId)
    )
    .slice(0, 3)
    .map(item => item.door);

  return {
    doors: candidates,
    registryWitness: input.registryWitness,
    diagnostics: [...new Set(diagnostics)].sort()
  };
}
