import { 
  CompiledIdea, 
  UnderstandingStage, 
  ArchitecturalCheckResult, 
  Proposal, 
  ProposalType, 
  DispatchTarget,
  RepositoryId,
  Attachment 
} from '../types/founderNode';
import { COLLECTIVE_REPOSITORIES } from '../data/mockCollectiveRepos';

export interface CompileOptions {
  rawText: string;
  attachments?: Attachment[];
  selectedTargetRepos?: RepositoryId[];
  requestedProposalTypes?: ProposalType[];
  architecturalMemoryEnabled?: boolean;
}

export async function compileFounderIntent(options: CompileOptions): Promise<CompiledIdea> {
  const {
    rawText,
    attachments = [],
    requestedProposalTypes = ['github_issue', 'specification', 'aistudio_prompt'],
    architecturalMemoryEnabled = true
  } = options;

  // Attempt server-side API compilation with Gemini
  try {
    const response = await fetch('/api/compile-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText,
        attachmentsSummary: attachments.map(a => `${a.type}: ${a.name}`).join(', '),
        requestedProposalTypes,
        architecturalMemoryEnabled
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.understanding && data.architecturalCheck) {
        return {
          id: `compiled-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          rawText,
          createdAt: new Date().toISOString(),
          attachments,
          understanding: data.understanding,
          architecturalCheck: data.architecturalCheck,
          proposals: data.proposals || generateFallbackProposals(rawText, data.understanding, requestedProposalTypes)
        };
      }
    }
  } catch {
    console.info('Server endpoint unavailable or fallback mode active. Compiling intent locally...');
  }

  // Local-first deterministic Intent Compiler Engine
  return compileLocally(rawText, attachments, requestedProposalTypes, architecturalMemoryEnabled);
}

function compileLocally(
  rawText: string,
  attachments: Attachment[],
  requestedTypes: ProposalType[],
  memoryEnabled: boolean
): CompiledIdea {
  const textLower = rawText.toLowerCase();

  // Detect relevant repos
  const potentialRepos: RepositoryId[] = [];
  if (textLower.includes('toaster') || textLower.includes('haunted') || textLower.includes('imagination') || textLower.includes('creative')) {
    potentialRepos.push('haunted-toaster');
  }
  if (textLower.includes('audio') || textLower.includes('music') || textLower.includes('band') || textLower.includes('dsp') || textLower.includes('sound')) {
    potentialRepos.push('band-runtime');
  }
  if (textLower.includes('tranch') || textLower.includes('slice') || textLower.includes('worker') || textLower.includes('render') || textLower.includes('node')) {
    potentialRepos.push('tranchnode');
  }
  if (textLower.includes('identity') || textLower.includes('key') || textLower.includes('project0') || textLower.includes('auth') || textLower.includes('canonical')) {
    potentialRepos.push('project0');
  }
  if (textLower.includes('visual') || textLower.includes('ui') || textLower.includes('lab') || textLower.includes('shader')) {
    potentialRepos.push('toaster-lab');
  }
  if (textLower.includes('telemetry') || textLower.includes('monitor') || textLower.includes('health') || textLower.includes('nose')) {
    potentialRepos.push('tranchnose');
  }
  if (textLower.includes('feedback') || textLower.includes('return') || textLower.includes('loop') || textLower.includes('recoreturn')) {
    potentialRepos.push('recoreturn');
  }
  if (potentialRepos.length === 0) {
    potentialRepos.push('haunted-toaster', 'tranchnode');
  }

  // Extract Understanding Stage
  const understanding: UnderstandingStage = {
    observedFacts: [
      `Raw intention expressed: "${rawText.substring(0, 90)}${rawText.length > 90 ? '...' : ''}"`,
      `Context includes ${attachments.length} attachment(s) and multi-modal assets.`,
      `Ecosystem domain touches: ${potentialRepos.map(r => COLLECTIVE_REPOSITORIES.find(repo => repo.id === r)?.name).join(', ')}.`
    ],
    goals: [
      `Translate raw founder thought into reviewable architectural proposals.`,
      `Preserve authority boundaries across ${potentialRepos.join(', ')}.`,
      `Prepare actionable specifications for downstream execution systems.`
    ],
    constraints: [
      `Proposal Authority Only: Application cannot execute external code directly without human approval.`,
      `Architectural Boundary Law: Upstream systems cannot own runtime execution law.`,
      `Local-First Auditability: Every proposal must generate a traceable receipt.`
    ],
    unknowns: [
      `Specific API schema version for external dispatch targets.`,
      `Target repository milestone assignment and priority slice sequence.`
    ],
    potentialRepositories: potentialRepos,
    dependencies: [
      textLower.includes('render') || textLower.includes('video') ? 'TranchNode #7 worker isolation protocol' : 'Project0 canonical key verification'
    ],
    risks: [
      `Architectural drift if execution authority is conflated across nodes.`,
      `Duplicate effort across ${potentialRepos.length > 1 ? potentialRepos.join(' and ') : 'downstream systems'}.`
    ],
    suggestedSlice: `Slice 1: Create specification and GitHub Issue for ${potentialRepos[0]}. Slice 2: Generate AI Studio / downstream execution prompts.`
  };

  // Architectural Memory Checks
  const memoryFlags: string[] = [];
  const authorityConflicts = [];

  if (memoryEnabled) {
    if (textLower.includes('haunted toaster') && (textLower.includes('execute') || textLower.includes('deploy') || textLower.includes('run code'))) {
      memoryFlags.push('⚠️ Haunted Toaster owns upstream imagination only. It must NEVER own execution law.');
      authorityConflicts.push({
        repository: 'Haunted Toaster',
        conflictReason: 'Attempting to assign execution law to Haunted Toaster violates Ecosystem Rule #1.',
        severity: 'high' as const
      });
    }

    if (textLower.includes('identity') || textLower.includes('auth') || textLower.includes('user login')) {
      memoryFlags.push('⚠️ Project0 already defines canonical identity and key registry for the network.');
      authorityConflicts.push({
        repository: 'Project0',
        conflictReason: 'Core identity must originate from Project0 key authority.',
        severity: 'medium' as const
      });
    }

    if (textLower.includes('audio') || textLower.includes('stem') || textLower.includes('dsp')) {
      memoryFlags.push('ℹ️ Band Runtime should consume audio specs, not implement bespoke user management.');
    }

    if (textLower.includes('tranch') || textLower.includes('worker') || textLower.includes('isolation')) {
      memoryFlags.push('⏳ Notice: Work in this slice is blocked until TranchNode #7 lands.');
    }

    if (memoryFlags.length === 0) {
      memoryFlags.push('✅ Architecture Verified: No conflicting authority domains detected in ecosystem memory.');
    }
  }

  const primaryRepo = potentialRepos[0] || 'haunted-toaster';
  const repoData = COLLECTIVE_REPOSITORIES.find(r => r.id === primaryRepo);

  const architecturalCheck: ArchitecturalCheckResult = {
    belongsTo: repoData?.name || 'Haunted Toaster',
    isNewWork: !textLower.includes('update') && !textLower.includes('fix'),
    isAlreadySolved: false,
    isDuplicated: authorityConflicts.length > 0,
    existingIssue: repoData?.openIssues[0] ? `#${repoData.openIssues[0].id} (${repoData.openIssues[0].title})` : null,
    authorityConflicts,
    dependenciesAndBlockers: [
      textLower.includes('tranch') ? 'TranchNode #7 (Worker Isolation)' : 'Project0 #16 (Canonical Authority Registration)'
    ],
    guidance: `Assign task authority to ${repoData?.name || 'primary repo'}. Ensure outputs are published as proposals for Founder review before dispatching.`,
    architecturalMemoryFlags: memoryFlags
  };

  // Generate Proposals
  const proposals = generateFallbackProposals(rawText, understanding, requestedTypes, primaryRepo);

  return {
    id: `compiled-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    rawText,
    createdAt: new Date().toISOString(),
    attachments,
    understanding,
    architecturalCheck,
    proposals
  };
}

function generateFallbackProposals(
  rawText: string,
  understanding: UnderstandingStage,
  requestedTypes: ProposalType[],
  primaryRepo: RepositoryId = 'haunted-toaster'
): Proposal[] {
  const now = new Date().toISOString();
  const repoData = COLLECTIVE_REPOSITORIES.find(r => r.id === primaryRepo);

  const proposals: Proposal[] = [];

  requestedTypes.forEach((type, idx) => {
    let title = '';
    let content = '';
    let defaultTarget: DispatchTarget = 'github';

    switch (type) {
      case 'github_issue':
        title = `feat(${primaryRepo}): ${rawText.substring(0, 55).replace(/\n/g, ' ')}`;
        defaultTarget = 'github';
        content = `## Overview
${rawText}

## Observed Facts & Context
${understanding.observedFacts.map(f => `- ${f}`).join('\n')}

## Proposed Architectural Scope
- **Target Repository**: \`${primaryRepo}\` (${repoData?.authorityDomain || 'Primary Domain'})
- **Suggested Slice**: ${understanding.suggestedSlice}

## Actionable Tasks
- [ ] Parse intent into modular interface definitions
- [ ] Review authority boundaries against ${primaryRepo} laws
- [ ] Implement slice in isolated feature branch
- [ ] Submit PR receipt back to Founder Node

## Constraints & Laws
${repoData?.laws.map(l => `- ${l}`).join('\n') || '- Proposal authority human review required.'}`;
        break;

      case 'specification':
        title = `Spec: ${primaryRepo.toUpperCase()} Architectural Specification`;
        defaultTarget = 'markdown';
        content = `# Architectural Specification: ${primaryRepo} Integration

## Intention Statement
> "${rawText}"

## System Goals
${understanding.goals.map(g => `1. ${g}`).join('\n')}

## Ecosystem Constraints
${understanding.constraints.map(c => `- ${c}`).join('\n')}

## Technical Slice Requirements
- **Primary Domain Owner**: \`${primaryRepo}\`
- **Dependencies**: ${understanding.dependencies.join(', ')}
- **Risk Mitigation**: ${understanding.risks.join('; ')}

## Receipt Verification Strategy
Upon dispatch, downstream system must emit a cryptographic execution receipt verified against Project0 identity rules.`;
        break;

      case 'aistudio_prompt':
        title = `AI Studio Prompt: ${primaryRepo} Upstream Imagination Engine`;
        defaultTarget = 'aistudio';
        content = `SYSTEM INSTRUCTION:
You are the Technical Project Architect for The Static Collective (${primaryRepo}).
Your responsibility is to translate raw founder intention into structured JSON payloads for downstream review.

FOUNDER INPUT:
${rawText}

RELEVANT CONTEXT:
${repoData?.readme || 'Standard Static Collective Repo'}

TASK:
1. Break down the input into structured sub-tasks.
2. Ensure no execution law is assumed by upstream nodes.
3. Emit structured JSON matching Founder Node proposal schema.`;
        break;

      case 'lovable_prompt':
        title = `Lovable Prompt: Full UI Component Prototype`;
        defaultTarget = 'lovable';
        content = `Create a dark, minimal, mission-control style web application module for The Static Collective.
Module Purpose: ${rawText.substring(0, 120)}
Theme: Dark zinc/slate (#090d16), crisp mono accents, high-contrast status chips, no avatars or emojis.
Features: Real-time update panels, action buttons with receipt logs, clean typographic hierarchy.`;
        break;

      case 'bolt_prompt':
        title = `Bolt Prompt: Standalone Micro-Node Service`;
        defaultTarget = 'bolt';
        content = `Build an isolated Node.js/TypeScript micro-service for ${primaryRepo}.
Requirements:
- Parse incoming webhook events
- Process data according to: ${rawText}
- Emit verified completion receipt payload to Founder Node
- Clean error handling with fallback states`;
        break;

      case 'architecture_note':
        title = `Architecture Note: Authority Boundaries & Memory Map`;
        defaultTarget = 'markdown';
        content = `# Architectural Memory Decision Log

## Proposal Target: ${primaryRepo}
## Date: ${new Date().toLocaleDateString()}

### Context & Intent
${rawText}

### Authority Mapping
- **Upstream Intent**: Captured in Founder Node
- **Authority Owner**: ${repoData?.name || primaryRepo}
- **Boundary Verification**: Passed architectural check with zero drift warnings.

### Recommendations
1. Maintain strict decoupling between imagination and execution.
2. Require human approval in Dispatch Queue before triggering external API payloads.`;
        break;

      default:
        title = `Proposal (${type}): ${primaryRepo} Work Item`;
        defaultTarget = 'github';
        content = `## Proposal Summary
${rawText}

## Target Ecosystem
${primaryRepo}`;
        break;
    }

    proposals.push({
      id: `prop-${Date.now()}-${idx}`,
      type,
      title,
      targetRepo: primaryRepo,
      content,
      summary: `Proposes ${type.replace(/_/g, ' ')} for ${primaryRepo} based on founder intent.`,
      status: 'draft',
      createdAt: now,
      dispatchTarget: defaultTarget
    });
  });

  return proposals;
}
