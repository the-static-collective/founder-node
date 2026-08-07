# Founder Node

> **Operating Console for The Static Collective**  
> Translates unstructured founder intent into structured, reviewable, and executable work across connected repositories and platforms (GitHub, AI Studio, Lovable, Bolt) while enforcing zero-drift architectural boundaries.

---

## ⚡ Key Capabilities

### 1. Multi-Format Idea Stream
- **Voice Transcription**: Live audio stream capture with waveform visualizer and speech-to-text recognition.
- **Pasted Chat Import**: Intelligent conversation transcript parser for Slack, Discord, and LLM chat threads.
- **Screenshot & Diagram OCR**: Optical analysis extracting visual layout structures and text specs from uploaded images.
- **Interactive Markdown & Mermaid Rendering**: Instant live previews and visual architecture diagram maps right inside the input console.

### 2. Architectural Memory & Boundary Matrix
- **Ecosystem Domain Rules**: Continuously verifies proposed founder actions against repository documentation across *Haunted Toaster*, *TranchNode*, *Project0*, *Band Runtime*, and *The Static Collective*.
- **Drift Prevention**: Automatically flags duplicated authority (e.g., duplicate auth user pools), incorrect work placement (e.g., execution code in upstream nodes), and unresolved dependencies.
- **Interactive Deep Audit**: Test proposed changes in real time and manage custom persisted architectural laws.

### 3. Visual Intent Pipeline
- **9-Stage Interactive Traceability**: Visualizes the complete life cycle of founder thoughts:
  1. `01. Idea` — Unstructured Intention
  2. `02. Understanding` — Observed Facts & System Goals
  3. `03. Arch Mapping` — Boundary & Authority Check
  4. `04. Project Selection` — Domain Routing
  5. `05. Proposal Generation` — Specs, Prompts & Issues
  6. `06. Human Review` — Founder Gatekeeper Authority
  7. `07. Dispatch` — Payload Execution Stream
  8. `08. Execution` — External Repositories/APIs
  9. `09. Receipt Log` — Cryptographic Provenance Hash
- **Stage Inspector**: Drill down into any stage to review raw inputs, parsed facts, and cryptographic hashes.

### 4. Proposal Generation & Human Authority Dispatch
- Multi-format spec compiler: **GitHub Issues**, **Specifications**, **AI Studio Prompts**, **Lovable Prompts**, **Bolt Prompts**, **Architecture Notes**, **Implementation Plans**, **PR Reviews**, and **Dependency Maps**.
- **Human Review Mandate**: No payload is dispatched to external systems without explicit human authorization.
- **Execution Receipts**: Cryptographically signed result logs storing hash signatures and payload provenance.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite

---

## 🚀 Local Setup & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Check TypeScript types**:
   ```bash
   npm run lint
   ```

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```text
├── src/
│   ├── components/
│   │   ├── ArchitecturalMemoryPanel.tsx # Architectural laws & drift checker
│   │   ├── CommandBridgeOverview.tsx    # Mission control & metrics
│   │   ├── PipelineVisualizer.tsx       # Interactive 9-stage visual journey
│   │   ├── IdeaStream.tsx                # Multi-format input & voice stream
│   │   ├── PasteConversationModal.tsx   # Chat transcript importer
│   │   ├── ProposalGenerator.tsx        # Spec & prompt compiler
│   │   ├── DispatchQueue.tsx            # Human review gatekeeper queue
│   │   ├── ExecutionReceipts.tsx        # Cryptographic execution log
│   │   └── RepositoryContextBrowser.tsx # Ecosystem repo documentation
│   ├── data/
│   │   └── mockCollectiveRepos.ts       # Connected repo boundaries & issues
│   ├── services/
│   │   └── compilerEngine.ts            # Intent compiler & boundary auditor
│   ├── types/
│   │   └── founderNode.ts               # Core domain TypeScript models
│   └── App.tsx                          # Primary console layout
├── package.json
└── README.md
```
