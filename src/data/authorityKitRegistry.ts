import type { RepositoryContext, RepositoryKind, RepositoryStatus } from '../types/founderNode';
import type { AuthorityInvariantRecord, AuthorityRegistryBundle } from '../types/nearbyGrowth';

export const AUTHORITY_PROJECTS_URL =
  'https://raw.githubusercontent.com/the-static-collective/jubilee-authority-kit/main/registry/projects.json';
export const AUTHORITY_INVARIANTS_URL =
  'https://raw.githubusercontent.com/the-static-collective/jubilee-authority-kit/main/registry/invariants.json';
export const AUTHORITY_REGISTRY_URL = AUTHORITY_PROJECTS_URL;

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

interface AuthorityProjectRegistryDocument {
  version: number;
  updated: string;
  projects: AuthorityProjectRecord[];
}

interface AuthorityInvariantRegistryDocument {
  version: number;
  updated: string;
  invariants: AuthorityInvariantRecord[];
}

let cachedProjectsDocument: AuthorityProjectRegistryDocument | null = null;
let cachedBundle: AuthorityRegistryBundle | null = null;

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

const fetchRegistry = async (url: string, label: string): Promise<Response> => {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (error) {
    throw new Error(`Authority Kit ${label} unavailable: ${String(error)}`);
  }
};

function validateProjectsDocument(
  projectsDocument: AuthorityProjectRegistryDocument,
): AuthorityProjectRegistryDocument {
  if (
    !projectsDocument
    || projectsDocument.version !== 1
    || !Array.isArray(projectsDocument.projects)
    || !projectsDocument.updated?.trim()
  ) {
    throw new Error('Authority Kit project registry is malformed or uses an unsupported version.');
  }

  const projectIds = new Set<string>();
  for (const project of projectsDocument.projects) {
    if (!project.id || projectIds.has(project.id)) {
      throw new Error(`Authority Kit project registry contains an invalid or duplicate project id: ${project.id || '<missing>'}`);
    }
    projectIds.add(project.id);
  }

  return projectsDocument;
}

async function loadProjectRegistryDocument(
  force = false,
): Promise<AuthorityProjectRegistryDocument> {
  if (cachedProjectsDocument && !force) return cachedProjectsDocument;

  const projectsResponse = await fetchRegistry(AUTHORITY_PROJECTS_URL, 'project registry');
  const projectsDocument = validateProjectsDocument(
    (await projectsResponse.json()) as AuthorityProjectRegistryDocument,
  );
  cachedProjectsDocument = projectsDocument;
  return projectsDocument;
}

export async function loadAuthorityRegistryBundle(force = false): Promise<AuthorityRegistryBundle> {
  if (cachedBundle && !force) return cachedBundle;

  const projectsDocument = await loadProjectRegistryDocument(force);
  const invariantsResponse = await fetchRegistry(AUTHORITY_INVARIANTS_URL, 'invariant registry');
  const invariantsDocument = (await invariantsResponse.json()) as AuthorityInvariantRegistryDocument;

  if (!invariantsDocument || invariantsDocument.version !== 1 || !Array.isArray(invariantsDocument.invariants) || !invariantsDocument.updated?.trim()) {
    throw new Error('Authority Kit invariant registry is malformed or uses an unsupported version.');
  }

  const projectIds = new Set(projectsDocument.projects.map(project => project.id));
  const invariantIds = new Set<string>();
  for (const invariant of invariantsDocument.invariants) {
    if (!invariant.id || invariantIds.has(invariant.id)) {
      throw new Error(`Authority Kit invariant registry contains an invalid or duplicate invariant id: ${invariant.id || '<missing>'}`);
    }
    invariantIds.add(invariant.id);
    if (!projectIds.has(invariant.owner)) {
      throw new Error(`Authority Kit invariant ${invariant.id} references unknown owner: ${invariant.owner}`);
    }
    if (!Array.isArray(invariant.consumers)) {
      throw new Error(`Authority Kit invariant ${invariant.id} has malformed consumers.`);
    }
    for (const consumer of invariant.consumers) {
      if (!projectIds.has(consumer)) {
        throw new Error(`Authority Kit invariant ${invariant.id} references unknown consumer: ${consumer}`);
      }
    }
  }

  const nextBundle: AuthorityRegistryBundle = {
    repositories: projectsDocument.projects.map(toContext),
    invariants: invariantsDocument.invariants,
    witness: {
      projects: { version: projectsDocument.version, updated: projectsDocument.updated, source: AUTHORITY_PROJECTS_URL },
      invariants: { version: invariantsDocument.version, updated: invariantsDocument.updated, source: AUTHORITY_INVARIANTS_URL }
    }
  };

  cachedBundle = nextBundle;
  return nextBundle;
}

export async function loadCollectiveRepositories(force = false): Promise<RepositoryContext[]> {
  const projectsDocument = await loadProjectRegistryDocument(force);
  return projectsDocument.projects.map(toContext);
}

export function clearAuthorityRegistryCache() {
  cachedProjectsDocument = null;
  cachedBundle = null;
}
