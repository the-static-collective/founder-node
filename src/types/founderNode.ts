import type { NearbyGrowthResult } from './nearbyGrowth';

export type RepositoryId = string;

export type RepositoryStatus = 'active' | 'seed' | 'dormant' | 'ancestor' | 'monument' | 'unresolved';
export type RepositoryKind =
  | 'constitutional-substrate'
  | 'shared-protocol'
  | 'domain-kernel'
  | 'proposal-discovery'
  | 'embodiment'
  | 'research-kernel'
  | 'control-plane'
  | 'lineage-ancestor'
  | 'concept-donor'
  | 'unresolved';

export interface RepositoryRelation {
  type: string;
  target: RepositoryId;
  note?: string;
}

export interface RepositoryContext {
  id: RepositoryId;
  repository: string;
  kind: RepositoryKind;
  status: RepositoryStatus;
  role: string;
  owns: string[];
  nonAuthority: string[];
  relations: RepositoryRelation[];
  name: string;
  description: string;
  authorityDomain: string;
  laws: string[];
  readme: string;
  architecture: string;
  openIssues: Array<{
    id: number;
    title: string;
    state: 'open' | 'closed';
    labels: string[];
    author: string;
    createdAt: string;
  }>;
  activePRs: Array<{
    id: number;
    title: string;
    author: string;
    status: 'review_required' | 'approved' | 'draft';
    branch: string;
  }>;
  recentCommits: Array<{
    hash: string;
    message: string;
    date: string;
    author: string;
  }>;
  roadmap: string[];
}

export interface UnderstandingStage {
  observedFacts: string[];
  goals: string[];
  constraints: string[];
  unknowns: string[];
  potentialRepositories: RepositoryId[];
  dependencies: string[];
  risks: string[];
  suggestedSlice: string;
}

export interface AuthorityConflict {
  repository: string;
  conflictReason: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ArchitecturalCheckResult {
  belongsTo: string;
  isNewWork: boolean;
  isAlreadySolved: boolean;
  isDuplicated: boolean;
  existingIssue: string | null;
  authorityConflicts: AuthorityConflict[];
  dependenciesAndBlockers: string[];
  guidance: string;
  architecturalMemoryFlags: string[];
  routingBlocked?: boolean;
}

export type ProposalType =
  | 'github_issue'
  | 'pr_review'
  | 'architecture_note'
  | 'specification'
  | 'research_task'
  | 'aistudio_prompt'
  | 'lovable_prompt'
  | 'bolt_prompt'
  | 'implementation_plan'
  | 'experiment_design'
  | 'readme_update'
  | 'refactor_proposal'
  | 'project_split'
  | 'dependency_map';

export type DispatchTarget =
  | 'github'
  | 'lovable'
  | 'bolt'
  | 'aistudio'
  | 'gemini_cli'
  | 'gdocs'
  | 'markdown'
  | 'local_files'
  | 'notion'
  | 'supabase'
  | 'band_runtime';

export interface Proposal {
  id: string;
  type: ProposalType;
  title: string;
  targetRepo: RepositoryId | 'ecosystem-global';
  content: string;
  summary: string;
  status: 'draft' | 'queued' | 'approved' | 'dispatched' | 'rejected';
  createdAt: string;
  dispatchTarget: DispatchTarget;
}

export interface DispatchReceipt {
  id: string;
  proposalId: string;
  ideaRaw: string;
  ideaSummary: string;
  interpretationSummary: string;
  proposalType: ProposalType;
  targetRepo: string;
  dispatchTarget: DispatchTarget;
  approvedBy: 'Founder';
  approvedAt: string;
  dispatchedAt: string;
  externalResult: {
    status: 'success' | 'simulated_success' | 'error';
    payloadSummary: string;
    referenceUrl?: string;
    receiptHash: string;
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'diagram' | 'text';
  dataUrl?: string;
  sizeFormatted?: string;
}

export interface CompiledIdea {
  id: string;
  rawText: string;
  createdAt: string;
  attachments: Attachment[];
  understanding: UnderstandingStage;
  architecturalCheck: ArchitecturalCheckResult;
  proposals: Proposal[];
  nearbyGrowth?: NearbyGrowthResult;
}
