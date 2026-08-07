import {
  Attachment,
  ArchitecturalCheckResult,
  AuthorityConflict,
  CompiledIdea,
  DispatchTarget,
  Proposal,
  ProposalType,
  RepositoryContext,
  RepositoryId,
  UnderstandingStage
} from '../types/founderNode';
import { loadCollectiveRepositories } from '../data/authorityKitRegistry';

export interface CompileOptions {
  rawText: string;
  attachments?: Attachment[];
  selectedTargetRepos?: RepositoryId[];
  requestedProposalTypes?: ProposalType[];
  architecturalMemoryEnabled?: boolean;
}

interface RoutingResult {
  targets: RepositoryContext[];
  conflicts: AuthorityConflict[];
  blocked: boolean;
}

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

const significantTokens = (value: string) =>
  normalize(value).split(' ').filter(token => token.length >= 4);

const phraseMatchesIntent = (intent: string, phrase: string) => {
  const normalizedIntent = normalize(intent);
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase) return false;
  if (normalizedIntent.includes(normalizedPhrase)) return true;
  const tokens = significantTokens(phrase);
  return tokens.length > 0 && tokens.every(token => normalizedIntent.includes(token));
};

const revivalRequested = (intent: string) =>
  /\b(revive|revival|reactivate|re-activate|resurrect|restore to active|bring back)\b/i.test(intent);

const isLegacyDefaultSelection = (rawText: string, selectedTargetRepos: RepositoryId[]) => {
  const selected = new Set(selectedTargetRepos);
  const isLegacyPair = selected.size === 2 && selected.has('haunted-toaster') && selected.has('tranchnode');
  if (!isLegacyPair) return false;
  const intent = normalize(rawText);
  return !intent.includes('haunted toaster') && !intent.includes('tranchnode') && !intent.includes('tranch node');
};

function resolveTargets(
  rawText: string,
  selectedTargetRepos: RepositoryId[],
  repositories: RepositoryContext[]
): RepositoryContext[] {
  const byId = new Map(repositories.map(repo => [repo.id, repo]));
  const selected = selectedTargetRepos.map(id => byId.get(id)).filter(Boolean) as RepositoryContext[];
  if (selected.length && !isLegacyDefaultSelection(rawText, selectedTargetRepos)) return selected;

  const normalizedIntent = normalize(rawText);
  const direct = repositories.filter(repo => {
    const repoLeaf = repo.repository.split('/').pop() || repo.id;
    return normalizedIntent.includes(normalize(repo.id)) || normalizedIntent.includes(normalize(repoLeaf));
  });
  if (direct.length) return direct;

  const scored = repositories
    .map(repo => {
      const phrases = [repo.role, ...repo.owns];
      const score = phrases.reduce((sum, phrase) => sum + (phraseMatchesIntent(rawText, phrase) ? 1 : 0), 0);
      return { repo, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.repo);

  if (scored.length) return scored.slice(0, 3);
  const founderNode = byId.get('founder-node');
  return founderNode ? [founderNode] : [];
}

function checkRouting(rawText: string, targets: RepositoryContext[]): RoutingResult {
  const conflicts: AuthorityConflict[] = [];
  const explicitRevival = revivalRequested(rawText);

  for (const repo of targets) {
    if ((repo.status === 'ancestor' || repo.status === 'monument' || repo.kind === 'lineage-ancestor') && !explicitRevival) {
      conflicts.push({
        repository: repo.repository,
        conflictReason: `${repo.id} is classified as ${repo.status}/${repo.kind}. Routing work there requires an explicit revival instruction.`,
        severity: 'high'
      });
    }

    for (const deniedCapability of repo.nonAuthority) {
      if (phraseMatchesIntent(rawText, deniedCapability)) {
        conflicts.push({
          repository: repo.repository,
          conflictReason: `Intent targets declared non-authority: "${deniedCapability}". Route that capability to its owning repository instead.`,
          severity: 'high'
        });
      }
    }
  }

  return { targets, conflicts, blocked: conflicts.some(conflict => conflict.severity === 'high') };
}

export async function compileFounderIntent(options: CompileOptions): Promise<CompiledIdea> {
  const {
    rawText,
    attachments = [],
    selectedTargetRepos = [],
    requestedProposalTypes = ['github_issue', 'specification', 'aistudio_prompt'],
    architecturalMemoryEnabled = true
  } = options;

  const repositories = await loadCollectiveRepositories();
  const targets = resolveTargets(rawText, selectedTargetRepos, repositories);
  const routing = checkRouting(rawText, targets);

  if (routing.blocked) {
    return blockedCompilation(rawText, attachments, routing);
  }

  try {
    const response = await fetch('/api/compile-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText,
        attachmentsSummary: attachments.map(a => `${a.type}: ${a.name}`).join(', '),
        requestedProposalTypes,
        selectedTargetRepos: targets.map(repo => repo.id),
        architecturalMemoryEnabled
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.understanding && data.architecturalCheck) {
        const primary = targets[0] ?? repositories.find(repo => repo.id === 'founder-node') ?? repositories[0];
        const serverConflicts: AuthorityConflict[] = Array.isArray(data.architecturalCheck.authorityConflicts)
          ? data.architecturalCheck.authorityConflicts
          : [];
        const serverBlocked = serverConflicts.some(conflict => conflict.severity === 'high');

        return {
          id: makeId('compiled'),
          rawText,
          createdAt: new Date().toISOString(),
          attachments,
          understanding: {
            ...data.understanding,
            potentialRepositories: targets.map(repo => repo.id)
          },
          architecturalCheck: {
            ...data.architecturalCheck,
            belongsTo: primary?.repository || data.architecturalCheck.belongsTo,
            authorityConflicts: serverConflicts,
            routingBlocked: serverBlocked
          },
          proposals: serverBlocked
            ? []
            : data.proposals || generateFallbackProposals(rawText, data.understanding, requestedProposalTypes, primary)
        };
      }
    }
  } catch {
    console.info('Server endpoint unavailable. Compiling against Authority Kit registry locally.');
  }

  return compileLocally(rawText, attachments, requestedProposalTypes, routing, architecturalMemoryEnabled);
}

function blockedCompilation(rawText: string, attachments: Attachment[], routing: RoutingResult): CompiledIdea {
  const targetNames = routing.targets.map(repo => repo.repository);
  return {
    id: makeId('compiled'),
    rawText,
    createdAt: new Date().toISOString(),
    attachments,
    understanding: {
      observedFacts: [`Founder intent targets: ${targetNames.join(', ') || 'no resolved repository'}.`],
      goals: ['Route the requested work without violating declared repository authority boundaries.'],
      constraints: routing.conflicts.map(conflict => conflict.conflictReason),
      unknowns: [],
      potentialRepositories: routing.targets.map(repo => repo.id),
      dependencies: [],
      risks: ['Dispatching this intent as written would cross a declared authority boundary.'],
      suggestedSlice: 'Resolve the authority conflict or explicitly revive the historical repository before generating work.'
    },
    architecturalCheck: {
      belongsTo: targetNames.join(', ') || 'unresolved',
      isNewWork: true,
      isAlreadySolved: false,
      isDuplicated: false,
      existingIssue: null,
      authorityConflicts: routing.conflicts,
      dependenciesAndBlockers: routing.conflicts.map(conflict => conflict.conflictReason),
      guidance: routing.conflicts[0]?.conflictReason || 'Routing blocked by Authority Kit registry.',
      architecturalMemoryFlags: routing.conflicts.map(conflict => `BLOCKED: ${conflict.conflictReason}`),
      routingBlocked: true
    },
    proposals: []
  };
}

function compileLocally(
  rawText: string,
  attachments: Attachment[],
  requestedTypes: ProposalType[],
  routing: RoutingResult,
  memoryEnabled: boolean
): CompiledIdea {
  const primary = routing.targets[0];
  const targetIds = routing.targets.map(repo => repo.id);
  const understanding: UnderstandingStage = {
    observedFacts: [
      `Raw intention expressed: "${rawText.substring(0, 90)}${rawText.length > 90 ? '...' : ''}"`,
      `Authority Kit registry resolved target(s): ${targetIds.join(', ') || 'none'}.`,
      `Context includes ${attachments.length} attachment(s).`
    ],
    goals: ['Translate founder intent into reviewable proposals while preserving repository ownership.'],
    constraints: [
      'Founder Node proposes work; it does not acquire downstream execution authority.',
      ...(primary ? primary.nonAuthority.map(item => `${primary.id} does not own: ${item}`) : [])
    ],
    unknowns: [],
    potentialRepositories: targetIds,
    dependencies: primary?.relations.map(relation => `${relation.type} ${relation.target}`) ?? [],
    risks: primary ? [`Authority drift if work exceeds ${primary.id}'s declared owns boundary.`] : ['No repository target resolved.'],
    suggestedSlice: primary
      ? `Create the smallest falsifiable slice inside ${primary.repository}; stop before crossing its nonAuthority boundary.`
      : 'Clarify the owning repository before dispatch.'
  };

  const architecturalCheck: ArchitecturalCheckResult = {
    belongsTo: primary?.repository || 'unresolved',
    isNewWork: true,
    isAlreadySolved: false,
    isDuplicated: false,
    existingIssue: null,
    authorityConflicts: [],
    dependenciesAndBlockers: understanding.dependencies,
    guidance: primary
      ? `Route only work owned by ${primary.repository}: ${primary.owns.join(', ') || 'no positive authority claims declared'}.`
      : 'No owner resolved from the registry.',
    architecturalMemoryFlags: memoryEnabled
      ? [`Registry authority verified for ${targetIds.join(', ') || 'no target'}.`]
      : [],
    routingBlocked: false
  };

  return {
    id: makeId('compiled'),
    rawText,
    createdAt: new Date().toISOString(),
    attachments,
    understanding,
    architecturalCheck,
    proposals: primary ? generateFallbackProposals(rawText, understanding, requestedTypes, primary) : []
  };
}

function generateFallbackProposals(
  rawText: string,
  understanding: UnderstandingStage,
  requestedTypes: ProposalType[],
  primaryRepo: RepositoryContext
): Proposal[] {
  const now = new Date().toISOString();

  return requestedTypes.map((type, idx) => {
    let title = '';
    let content = '';
    let dispatchTarget: DispatchTarget = 'github';

    switch (type) {
      case 'github_issue':
        title = `feat(${primaryRepo.id}): ${rawText.substring(0, 55).replace(/\n/g, ' ')}`;
        content = `## Purpose\n\n${rawText}\n\n## Authority boundary\n\nOwner: \`${primaryRepo.repository}\`\n\nOwns: ${primaryRepo.owns.join(', ') || 'none declared'}\n\nMust not claim: ${primaryRepo.nonAuthority.join(', ') || 'none declared'}\n\n## Dependencies\n\n${understanding.dependencies.map(item => `- ${item}`).join('\n') || '- none declared'}\n\n## Acceptance proof\n\n- [ ] Add one falsifiable executable proof for the requested behavior.\n- [ ] Show that the proof remains inside the declared authority boundary.\n\n## Non-goals\n\n- Do not move authority from another repository into this one.\n- Do not widen the slice beyond the requested capability.\n\n## Stop condition\n\nStop when the acceptance proof passes and no declared nonAuthority capability is required.`;
        break;
      case 'specification':
        dispatchTarget = 'markdown';
        title = `Spec: ${primaryRepo.id} bounded implementation`;
        content = `# ${primaryRepo.repository}\n\n## Intent\n${rawText}\n\n## Owner\n${primaryRepo.repository}\n\n## Authority\n${primaryRepo.owns.map(item => `- ${item}`).join('\n')}\n\n## Non-authority\n${primaryRepo.nonAuthority.map(item => `- ${item}`).join('\n')}\n\n## Suggested slice\n${understanding.suggestedSlice}`;
        break;
      case 'aistudio_prompt':
        dispatchTarget = 'aistudio';
        title = `AI Studio Prompt: ${primaryRepo.id} proposal work`;
        content = `You are proposing work for ${primaryRepo.repository}.\n\nFounder intent:\n${rawText}\n\nThis repository owns:\n${primaryRepo.owns.map(item => `- ${item}`).join('\n')}\n\nIt explicitly does not own:\n${primaryRepo.nonAuthority.map(item => `- ${item}`).join('\n')}\n\nGenerate proposal material only. Do not silently acquire any non-authority capability.`;
        break;
      case 'lovable_prompt':
        dispatchTarget = 'lovable';
        title = `Lovable Prompt: ${primaryRepo.id}`;
        content = `Build only the UI/product slice described here: ${rawText}\nRespect ${primaryRepo.repository}'s authority boundary and do not implement: ${primaryRepo.nonAuthority.join(', ')}.`;
        break;
      case 'bolt_prompt':
        dispatchTarget = 'bolt';
        title = `Bolt Prompt: ${primaryRepo.id}`;
        content = `Implement the smallest bounded code slice for ${primaryRepo.repository}: ${rawText}\nDo not absorb authority for: ${primaryRepo.nonAuthority.join(', ')}.`;
        break;
      default:
        dispatchTarget = 'markdown';
        title = `${type.replace(/_/g, ' ')}: ${primaryRepo.id}`;
        content = `${rawText}\n\nOwner: ${primaryRepo.repository}\nAuthority boundary: ${primaryRepo.owns.join(', ')}\nNon-authority: ${primaryRepo.nonAuthority.join(', ')}`;
        break;
    }

    return {
      id: `${makeId('prop')}-${idx}`,
      type,
      title,
      targetRepo: primaryRepo.id,
      content,
      summary: `Proposal for ${primaryRepo.repository}, bounded by Authority Kit registry declarations.`,
      status: 'draft',
      createdAt: now,
      dispatchTarget
    };
  });
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
