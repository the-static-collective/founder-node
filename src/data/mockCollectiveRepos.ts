import { RepositoryContext } from '../types/founderNode';

export const COLLECTIVE_REPOSITORIES: RepositoryContext[] = [
  {
    id: 'haunted-toaster',
    name: 'Haunted Toaster',
    description: 'Upstream imagination & speculative synthesis engine. Generates wild creative vectors without owning execution laws.',
    authorityDomain: 'Creative Speculation & Prompt Synthesis (Upstream)',
    laws: [
      'Must remain purely speculative and never execute deployment code directly.',
      'All execution outputs must be delegated downstream to TranchNode or Band Runtime.',
      'Acts as the generative spark; downstream systems own verification.'
    ],
    readme: `# Haunted Toaster
Upstream imagination engine for The Static Collective.
Transforms chaotic prompts and artistic stems into wild creative specs and multi-agent directives.

## Architecture Boundary
Haunted Toaster owns **IMAGINATION ONLY**. It does not enforce runtime laws or execute code deployment.`,
    architecture: `Upstream Generative Layer -> Prompt Synthesis Pipeline -> Submits Spec Proposals to Founder Node.`,
    openIssues: [
      { id: 101, title: 'spec: Generative Audio Stems to Visualizer Vector Pipeline', state: 'open', labels: ['enhancement', 'speculative'], author: 'joyvolcano', createdAt: '2026-08-01' },
      { id: 102, title: 'policy: Define imagination boundary versus execution law', state: 'open', labels: ['architecture', 'law'], author: 'joyvolcano', createdAt: '2026-08-04' }
    ],
    activePRs: [
      { id: 12, title: 'feat: Add prompt expansion vector for multi-track stems', author: 'ai-agent-01', status: 'review_required', branch: 'feat/stem-vectors' }
    ],
    recentCommits: [
      { hash: 'a8f102c', message: 'refactor: Clarify upstream authority boundaries', date: '2026-08-06', author: 'joyvolcano' },
      { hash: 'e9c301d', message: 'docs: Add Haunted Toaster manifest specs', date: '2026-08-03', author: 'joyvolcano' }
    ],
    roadmap: [
      'v2.0 Upstream AI Studio integration',
      'Multi-modal audio stem speculative analysis',
      'Cross-repo prompt compilation bridge'
    ]
  },
  {
    id: 'band-runtime',
    name: 'Band Runtime',
    description: 'Audio & musical event execution runtime. Consumes verified audio specs and orchestrates sound pipelines.',
    authorityDomain: 'Musical Event Execution & Audio Signal Processing',
    laws: [
      'Consumes verified execution specs from upstream proposal authority.',
      'Does not create core identity structures (delegates identity to Project0).',
      'Maintains deterministic audio graph execution.'
    ],
    readme: `# Band Runtime
Low-latency audio event engine and musical signal runtime for The Static Collective.

## Key Functions
- Real-time stem playback and synthesis state engine
- WebAudio / Native DSP pipeline driver
- Event trigger dispatcher`,
    architecture: `Audio Graph Driver -> WebAudio/DSP Pipeline -> MIDI/OSC Event Stream -> Output Bus.`,
    openIssues: [
      { id: 201, title: 'bug: Audio buffer glitch on multi-channel stem sync', state: 'open', labels: ['bug', 'dsp'], author: 'joyvolcano', createdAt: '2026-08-02' },
      { id: 202, title: 'feat: Connect event listener to TranchNode slice triggers', state: 'open', labels: ['feature', 'integration'], author: 'joyvolcano', createdAt: '2026-08-05' }
    ],
    activePRs: [
      { id: 4, title: 'fix: Buffer allocation for 24-bit 96kHz audio streams', author: 'ai-agent-02', status: 'approved', branch: 'fix/dsp-buffer' }
    ],
    recentCommits: [
      { hash: 'b7123aa', message: 'feat: Integrate stem sync clock listener', date: '2026-08-06', author: 'joyvolcano' }
    ],
    roadmap: [
      'Spatial audio bus integration',
      'Real-time streaming link to TranchNode',
      'Ultra-low latency web audio driver'
    ]
  },
  {
    id: 'tranchnode',
    name: 'TranchNode',
    description: 'Micro-node slice execution engine. Executes discrete code tranches and pipeline tasks.',
    authorityDomain: 'Discrete Slice & Micro-Task Execution',
    laws: [
      'Executes only approved tranches verified by Founder Node.',
      'Maintains strictly isolated execution contexts per tranche.',
      'Reports atomic receipts back to execution log.'
    ],
    readme: `# TranchNode
Executable micro-slice orchestrator for The Static Collective network.

## Concept
A 'tranch' is a discrete slice of work (audio render, code slice, deployment unit).
TranchNode runs atomic workloads and outputs verifiable receipts.`,
    architecture: `Tranch Ingestion -> Worker Container Isolation -> Step Verification -> Receipt Generation.`,
    openIssues: [
      { id: 301, title: 'feat: Automated audio-to-video rendering pipeline node', state: 'open', labels: ['pipeline', 'tranch-7'], author: 'joyvolcano', createdAt: '2026-08-03' },
      { id: 302, title: 'tranch-7: Canonical worker process isolation', state: 'open', labels: ['blocker', 'core'], author: 'joyvolcano', createdAt: '2026-08-06' }
    ],
    activePRs: [
      { id: 8, title: 'feat: Add worker execution receipt callback payload', author: 'ai-agent-03', status: 'review_required', branch: 'feat/worker-receipts' }
    ],
    recentCommits: [
      { hash: 'c99104b', message: 'feat: Standardize Tranch payload contract', date: '2026-08-07', author: 'joyvolcano' }
    ],
    roadmap: [
      'Tranch #7 Worker process isolation (BLOCKED DEPENDENCY)',
      'Distributed render node dispatch',
      'Automated receipt hashing'
    ]
  },
  {
    id: 'project0',
    name: 'Project0',
    description: 'Canonical identity & root authorization authority for the entire Static Collective network.',
    authorityDomain: 'Root Identity, Governance & Global Ecosystem Registry',
    laws: [
      'Single source of truth for global identity and public keys.',
      'No other repository may redefine core identity contracts or authorization law.',
      'Immutable cryptographic identifier authority.'
    ],
    readme: `# Project0
The foundational identity and governance layer of The Static Collective.

## Domain
- Canonical network identity & key registry
- Global namespace & repo authority boundaries
- System security rules`,
    architecture: `Root Key Registry -> Identity Provider Service -> Key Verification -> System Access Policy.`,
    openIssues: [
      { id: 15, title: 'sec: Key rotation protocol for distributed nodes', state: 'open', labels: ['security', 'governance'], author: 'joyvolcano', createdAt: '2026-07-28' },
      { id: 16, title: 'feat: Register Founder Node as canonical proposal authority', state: 'open', labels: ['identity', 'core'], author: 'joyvolcano', createdAt: '2026-08-06' }
    ],
    activePRs: [
      { id: 2, title: 'feat: Implement public key verification helper', author: 'joyvolcano', status: 'approved', branch: 'main' }
    ],
    recentCommits: [
      { hash: 'f00100a', message: 'chore: Update Project0 identity schema v1.2', date: '2026-08-05', author: 'joyvolcano' }
    ],
    roadmap: [
      'Zero-trust key validation protocol',
      'Canonical ecosystem manifest registry',
      'Proposal authority signature verification'
    ]
  },
  {
    id: 'toaster-lab',
    name: 'Toaster Lab',
    description: 'Experimental sandbox & visual playground for prototyping user interfaces and generative visualizers.',
    authorityDomain: 'Visual UI Sandbox & Rapid Prototyping Laboratory',
    laws: [
      'Safe sandbox for speculative visual features.',
      'Production code must be extracted into formal tranches before deployment.'
    ],
    readme: `# Toaster Lab
Visual laboratory and design playground for The Static Collective.`,
    architecture: `Visual Component Sandbox -> Canvas Renderer -> Design Spec Export.`,
    openIssues: [
      { id: 501, title: 'feat: Interactive 3D Audio Frequency Visualizer', state: 'open', labels: ['canvas', 'lab'], author: 'joyvolcano', createdAt: '2026-08-04' }
    ],
    activePRs: [],
    recentCommits: [
      { hash: 'd11209e', message: 'feat: Initial WebGL shader playground', date: '2026-08-02', author: 'joyvolcano' }
    ],
    roadmap: ['WebGPU visual shader engine', 'Exportable UI component library']
  },
  {
    id: 'tranchnose',
    name: 'TranchNOSE',
    description: 'Sensory telemetry monitor & node health observer across distributed execution targets.',
    authorityDomain: 'Telemetry, Logging & System Sensory Monitoring',
    laws: [
      'Passive monitoring and telemetry only.',
      'Cannot execute state mutations on other nodes.'
    ],
    readme: `# TranchNOSE
Sensory telemetry monitor for tracking execution health and node status.`,
    architecture: `Telemetry Collector -> Health Dashboard -> Alert Bus.`,
    openIssues: [
      { id: 11, title: 'feat: Real-time telemetry feed from TranchNode workers', state: 'open', labels: ['telemetry'], author: 'joyvolcano', createdAt: '2026-08-01' }
    ],
    activePRs: [],
    recentCommits: [
      { hash: 'e55410c', message: 'docs: Add TranchNOSE telemetry protocol', date: '2026-08-04', author: 'joyvolcano' }
    ],
    roadmap: ['Grafana/Prometheus adapter', 'Live node ping visualizer']
  },
  {
    id: 'recoreturn',
    name: 'reCOreturn',
    description: 'Feedback loop & return state processor. Analyzes execution outcomes and feeds refined telemetry upstream.',
    authorityDomain: 'Execution Analysis & Continuous Feedback Loops',
    laws: [
      'Transforms raw receipts into actionable architectural refinements.',
      'Feeds post-dispatch outcomes back to Founder Node.'
    ],
    readme: `# reCOreturn
Continuous feedback and return-state loop processor for The Static Collective.`,
    architecture: `Receipt Auditor -> Outcome Analyzer -> Architectural Memory Feedback Loop.`,
    openIssues: [
      { id: 601, title: 'feat: Auto-correlate dispatch receipts with issue resolutions', state: 'open', labels: ['feedback'], author: 'joyvolcano', createdAt: '2026-08-05' }
    ],
    activePRs: [],
    recentCommits: [
      { hash: 'f88210d', message: 'feat: Receipt correlation algorithm', date: '2026-08-06', author: 'joyvolcano' }
    ],
    roadmap: ['Automated architectural drift detection', 'Receipt outcome vector tracking']
  }
];
