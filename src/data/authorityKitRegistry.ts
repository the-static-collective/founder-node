import type { RepositoryContext, RepositoryKind, RepositoryStatus } from '../types/founderNode';

export const AUTHORITY_REGISTRY_URL =
  'https://raw.githubusercontent.com/the-static-collective/jubilee-authority-kit/main/registry/projects.json';

interface AuthorityProjectRecord {
  id: string;
  repository: string;
  kind: RepositoryKind;
  status: RepositoryStatus;
  role: string;
  owns: string[];
  nonAuthority: string[];
  relations: Array<{ type: string; target: string; note?: string }>;
}

interface AuthorityRegistryDocument {
  version: number;
  updated: string;
  projects: AuthorityProjectRecord[];
}

let cachedRepositories: RepositoryContext[] | null = null;

const displayName = (repository: string) => {
  const leaf = repository.split('/').pop() || repository;
  return leaf.replace(/[-_]+/g, ' ');
};

const toContext = (project: AuthorityProjectRecord): RepositoryContext => {
  const owns = project.owns.length ? project.owns.join(', ') : 'No positive authority claim declared';
  const relationLines = project.relations.length
    ? project.relations.map(relation => `${relation.type} -> ${relation.target}${relation.note ? ` — ${relation.note}` : ''}`)
    : ['No typed relations declared.'];

  return {
    ...project,
    name: displayName(project.repository),
    description: project.role,
    authorityDomain: owns,
    laws: [
      ...project.owns.map(claim => `Owns: ${claim}`),
      ...project.nonAuthority.map(claim => `Does not own: ${claim}`)
    ],
    readme: `# ${project.repository}\n\n${project.role}\n\nKind: ${project.kind}\nStatus: ${project.status}\n\nAuthority claims:\n${project.owns.map(item => `- ${item}`).join('\n') || '- none'}\n\nNon-authority:\n${project.nonAuthority.map(item => `- ${item}`).join('\n') || '- none'}`,
    architecture: relationLines.join('\n'),
    openIssues: [],
    activePRs: [],
    recentCommits: [],
    roadmap: relationLines
  };
};

export async function loadCollectiveRepositories(force = false): Promise<RepositoryContext[]> {
  if (cachedRepositories && !force) return cachedRepositories;

  let response: Response;
  try {
    response = await fetch(AUTHORITY_REGISTRY_URL, { cache: 'no-store' });
  } catch (error) {
    throw new Error(`Authority Kit registry unavailable: ${String(error)}`);
  }

  if (!response.ok) {
    throw new Error(`Authority Kit registry unavailable: HTTP ${response.status}`);
  }

  const registry = (await response.json()) as AuthorityRegistryDocument;
  if (!registry || registry.version !== 1 || !Array.isArray(registry.projects)) {
    throw new Error('Authority Kit registry is malformed or uses an unsupported version.');
  }

  const seen = new Set<string>();
  for (const project of registry.projects) {
    if (!project.id || seen.has(project.id)) {
      throw new Error(`Authority Kit registry contains an invalid or duplicate project id: ${project.id || '<missing>'}`);
    }
    seen.add(project.id);
  }

  cachedRepositories = registry.projects.map(toContext);
  return cachedRepositories;
}

export function clearAuthorityRegistryCache() {
  cachedRepositories = null;
}
