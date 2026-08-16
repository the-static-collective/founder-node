import type { RepositoryContext, RepositoryKind, RepositoryRelation, RepositoryStatus } from '../../src/types/founderNode';
import type { AuthorityInvariantRecord, AuthorityRegistryWitness } from '../../src/types/nearbyGrowth';

export function makeRepository(
  id: string,
  relations: RepositoryRelation[] = [],
  status: RepositoryStatus = 'active',
  kind: RepositoryKind = 'embodiment'
): RepositoryContext {
  return {
    id,
    repository: `the-static-collective/${id}`,
    kind,
    status,
    role: `${id} role`,
    owns: [],
    nonAuthority: [],
    relations,
    name: id,
    description: `${id} description`,
    authorityDomain: '',
    laws: [],
    readme: '',
    architecture: '',
    openIssues: [],
    activePRs: [],
    recentCommits: [],
    roadmap: []
  };
}

export const projects: RepositoryContext[] = [
  makeRepository('project0', [], 'active', 'constitutional-substrate'),
  makeRepository('tranchnode', [{ type: 'CONFORMS_TO', target: 'project0' }], 'active', 'constitutional-substrate'),
  makeRepository('haunted-toaster', [], 'active', 'domain-kernel'),
  makeRepository('band-runtime', [], 'active', 'domain-kernel'),
  makeRepository('toaster-lab', [{ type: 'PROPOSES_TO', target: 'haunted-toaster' }], 'active', 'proposal-discovery'),
  makeRepository('corpus-os', [
    { type: 'DEPENDS_ON', target: 'tranchnode' },
    { type: 'CONFORMS_TO', target: 'project0' }
  ], 'active', 'embodiment'),
  makeRepository('groove-rooms', [{ type: 'EMBODIES', target: 'band-runtime' }], 'active', 'embodiment'),
  makeRepository('jubilee-authority-kit', [], 'seed', 'shared-protocol'),
  makeRepository('tranchnose', [], 'active', 'research-kernel'),
  makeRepository('historical-donor', [{ type: 'DONATES_PATTERN_TO', target: 'jubilee-authority-kit' }], 'monument', 'concept-donor'),
  makeRepository('dormant-donor', [{ type: 'DONATES_PATTERN_TO', target: 'jubilee-authority-kit' }], 'dormant', 'concept-donor')
];

const invariant = (id: string, owner: string, consumers: string[]): AuthorityInvariantRecord => ({
  id,
  claim: id,
  owner,
  proof: `${id} proof`,
  formalRule: `${id} rule`,
  proofRefs: [{ repository: `the-static-collective/${owner}`, type: 'pull_request', number: 1, commit: 'a'.repeat(40) }],
  consumers,
  counterexamples: [`not ${id}`],
  maturity: 'proven'
});

export const invariants: AuthorityInvariantRecord[] = [
  invariant('immutable-source', 'tranchnode', ['corpus-os']),
  invariant('proposal-not-authority', 'toaster-lab', ['haunted-toaster']),
  invariant('refusal-preserves-state', 'band-runtime', ['groove-rooms']),
  invariant('replay-from-recorded-state', 'tranchnose', ['jubilee-authority-kit'])
];

export const witness: AuthorityRegistryWitness = {
  projects: { version: 1, updated: '2026-08-09', source: 'projects' },
  invariants: { version: 1, updated: '2026-08-07', source: 'invariants' }
};

export const projectDocument = {
  version: 1,
  updated: '2026-08-09',
  projects: projects.map(({ name, description, authorityDomain, laws, readme, architecture, openIssues, activePRs, recentCommits, roadmap, ...project }) => project)
};

export const invariantDocument = { version: 1, updated: '2026-08-07', invariants };
