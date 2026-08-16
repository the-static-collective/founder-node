import type { RepositoryContext, RepositoryStatus } from './founderNode';

export interface AuthorityProofRef {
  repository: string;
  type: string;
  number?: number;
  commit?: string;
}

export interface AuthorityInvariantRecord {
  id: string;
  claim: string;
  owner: string;
  proof: string;
  formalRule: string;
  proofRefs: AuthorityProofRef[];
  consumers: string[];
  counterexamples: string[];
  maturity: string;
}

export interface AuthorityRegistryWitnessEntry {
  version: number;
  updated: string;
  source: string;
}

export interface AuthorityRegistryWitness {
  projects: AuthorityRegistryWitnessEntry;
  invariants: AuthorityRegistryWitnessEntry;
}

export interface AuthorityRegistryBundle {
  repositories: RepositoryContext[];
  invariants: AuthorityInvariantRecord[];
  witness: AuthorityRegistryWitness;
}

export type NearbyGrowthEvidence =
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
      proofRefs: AuthorityProofRef[];
    };

export interface NearbyGrowthDoor {
  projectId: string;
  repository: string;
  role: string;
  status: RepositoryStatus;
  evidence: NearbyGrowthEvidence[];
}

export interface NearbyGrowthInput {
  routedProjectIds: string[];
  projects: RepositoryContext[];
  invariants: AuthorityInvariantRecord[];
  registryWitness: AuthorityRegistryWitness;
}

export interface NearbyGrowthResult {
  doors: NearbyGrowthDoor[];
  registryWitness: AuthorityRegistryWitness;
  diagnostics: string[];
}
